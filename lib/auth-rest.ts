import { HttpError } from './http';
type FirebaseSession={idToken:string;refreshToken:string;expiresIn:string;localId:string;email?:string};
export async function firebaseSign(endpoint:'signUp'|'signInWithPassword',email:string,password:string){
 const key=process.env.FIREBASE_WEB_API_KEY;
 if(!key) throw new Error('Falta FIREBASE_WEB_API_KEY');
 const res=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true}),cache:'no-store'});
 const data=await res.json();
 if(!res.ok){const code=String(data?.error?.message||'');if(code.includes('EMAIL_EXISTS'))throw new HttpError(409,'Correo ya registrado');if(code.includes('TOO_MANY_ATTEMPTS'))throw new HttpError(429,'Demasiados intentos');if(code.includes('WEAK_PASSWORD'))throw new HttpError(400,'Contraseña débil');throw new HttpError(endpoint==='signUp'?400:401,endpoint==='signUp'?'No fue posible registrar':'Credenciales inválidas')}
 return data as FirebaseSession;
}
export async function firebaseRefresh(refreshToken:string){
 const key=process.env.FIREBASE_WEB_API_KEY;if(!key)throw new Error('Falta FIREBASE_WEB_API_KEY');
 const res=await fetch(`https://securetoken.googleapis.com/v1/token?key=${key}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',refresh_token:refreshToken}),cache:'no-store'});
 if(!res.ok)throw new HttpError(401,'Sesión vencida');
 return await res.json() as {id_token:string;refresh_token:string;expires_in:string};
}
