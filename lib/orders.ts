import { db } from './firebase';
import { HttpError } from './http';
import type { z } from 'zod';
import type { orderInput } from './schemas';
export async function createOrder(uid:string,input:z.infer<typeof orderInput>){
 const now=new Date().toISOString();
 const quantities=new Map<string,number>();for(const i of input.items)quantities.set(i.producto_id,(quantities.get(i.producto_id)||0)+i.cantidad);
 if([...quantities.values()].some(q=>q>10))throw new HttpError(400,'Cantidad máxima de 10 por producto');
 const firestore=db();const orderRef=firestore.collection('pedidos').doc(input.id);
 const refs=[...quantities.keys()].map(id=>firestore.collection('productos').doc(id));
 return firestore.runTransaction(async tx=>{
  const existing=await tx.get(orderRef);if(existing.exists){if(existing.data()?.user_id!==uid)throw new HttpError(409,'Identificador ya utilizado');return existing.data()}
  const snapshots=await Promise.all(refs.map(r=>tx.get(r)));
  const items=snapshots.map((snap,index)=>{
   const p=snap.data();const cantidad=quantities.get(refs[index].id)!;
   if(!p||p.deleted_at)throw new HttpError(409,`Producto no disponible: ${refs[index].id}`);
   if(p.stock<cantidad)throw new HttpError(409,`Stock insuficiente: ${p.nombre}`);
   return {producto_id:snap.id,nombre:p.nombre,cantidad,precio_centavos:p.precio_centavos};
  });
  const total_centavos=items.reduce((sum,i)=>sum+i.precio_centavos*i.cantidad,0);
  const order={id:input.id,user_id:uid,total_centavos,estado:'pagado_simulado',direccion:input.direccion,items,creado_en:now,created_at:now,updated_at:now,deleted_at:null};
  refs.forEach((ref,index)=>tx.update(ref,{stock:snapshots[index].data()!.stock-items[index].cantidad,updated_at:now}));
  tx.create(orderRef,order);return order;
 });
}
