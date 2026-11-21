import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { auth } from './firebase';
export class HttpError extends Error {constructor(public status:number,message:string){super(message)}}
export const json=(body:unknown,status=200)=>NextResponse.json(body,{status});
export function errorResponse(e:unknown){
 if(e instanceof ZodError) return json({error:'Datos inválidos',detalles:e.issues.map(i=>({campo:i.path.join('.'),mensaje:i.message}))},400);
 if(e instanceof HttpError) return json({error:e.message},e.status);
 console.error('Error interno en solicitud');return json({error:'Error interno'},500);
}
export async function user(req:NextRequest){
 const header=req.headers.get('authorization')||'';
 if(!header.startsWith('Bearer ')) throw new HttpError(401,'Sesión no válida');
 try{return await auth().verifyIdToken(header.slice(7));}catch{throw new HttpError(401,'Sesión no válida')}
}
export async function admin(req:NextRequest){const u=await user(req);if(u.rol!=='admin')throw new HttpError(403,'No autorizado');return u}
export async function bodyJson(req:NextRequest){if(!req.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Se requiere JSON');try{return await req.json()}catch{throw new HttpError(400,'JSON inválido')}}
