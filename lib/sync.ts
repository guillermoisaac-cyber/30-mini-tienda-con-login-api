import {NextRequest} from 'next/server';import {z} from 'zod';import {db} from './firebase';import {HttpError,errorResponse,json,user,bodyJson} from './http';
import {favoritoInput,itemInput,uuid} from './schemas';
export const resources=['favoritos','carrito'] as const;
export type Resource=typeof resources[number];
const schema=(resource:Resource)=>resource==='favoritos'?favoritoInput:itemInput;
const collection=(uid:string,resource:Resource)=>db().collection('usuarios').doc(uid).collection(resource);
export async function listSync(req:NextRequest,resource:Resource){try{
 const u=await user(req);const since=req.nextUrl.searchParams.get('since');if(since&&!z.iso.datetime({offset:true}).safeParse(since).success)throw new HttpError(400,'Fecha inválida');
 let q=collection(u.uid,resource).orderBy('updated_at','asc').orderBy('__name__','asc').limit(500);
 if(since)q=q.where('updated_at','>',since);
 const snap=await q.get();return json({items:snap.docs.map(d=>({id:d.id,...d.data()})),servidor_ahora:new Date().toISOString()});
}catch(e){return errorResponse(e)}}
export async function putSync(req:NextRequest,resource:Resource,id:string){try{
 const u=await user(req);uuid.parse(id);const data=schema(resource).parse(await bodyJson(req));const ref=collection(u.uid,resource).doc(id);
 const previous=await ref.get();const now=new Date().toISOString();const doc={...data,created_at:previous.data()?.created_at||now,updated_at:now,deleted_at:null};await ref.set(doc);return json({id,...doc});
}catch(e){return errorResponse(e)}}
export async function deleteSync(req:NextRequest,resource:Resource,id:string){try{
 const u=await user(req);uuid.parse(id);const ref=collection(u.uid,resource).doc(id);const previous=await ref.get();if(!previous.exists)throw new HttpError(404,'No existe');
 const now=new Date().toISOString();await ref.update({deleted_at:now,updated_at:now});return json({ok:true});
}catch(e){return errorResponse(e)}}
