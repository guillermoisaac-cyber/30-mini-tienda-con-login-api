import {describe,it,expect,vi,beforeEach} from 'vitest';
vi.mock('../lib/firebase',()=>({auth:()=>({verifyIdToken:vi.fn(async(token:string)=>{if(token==='valid')return {uid:'user-1',email:'u@example.com'};if(token==='admin')return {uid:'root-1',rol:'admin'};throw Error('bad token')})}),db:()=>({})}));
import {GET as me} from '../app/api/auth/yo/route';
import {POST as signup} from '../app/api/auth/registro/route';
import {PUT as products} from '../app/api/productos/route';
import {NextRequest} from 'next/server';
const req=(url:string,init?:ConstructorParameters<typeof NextRequest>[1])=>new NextRequest(url,init);
describe('rutas de seguridad',()=>{
 beforeEach(()=>vi.restoreAllMocks());
 it('401 sin token',async()=>{const r=await me(req('https://example.com/api/auth/yo'));expect(r.status).toBe(401)});
 it('400 por correo inválido',async()=>{const r=await signup(req('https://example.com/api/auth/registro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'no-es-correo',password:'12345678'})}));expect(r.status).toBe(400)});
 it('403 sin rol admin',async()=>{const r=await products(req('https://example.com/api/productos?id=11111111-1111-4111-8111-111111111111',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer valid'},body:JSON.stringify({nombre:'A',precio_centavos:100,categoria:'B',imagen_url:null,stock:1})}));expect(r.status).toBe(403)});
});
