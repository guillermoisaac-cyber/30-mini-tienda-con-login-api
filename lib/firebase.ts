import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export function adminApp(){
  if(getApps().length) return getApps()[0];
  const projectId=process.env.FIREBASE_PROJECT_ID;
  const clientEmail=process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,'\n');
  if(!projectId||!clientEmail||!privateKey) throw new Error('Falta configuración Firebase Admin');
  return initializeApp({credential:cert({projectId,clientEmail,privateKey})});
}
export const auth=()=>getAuth(adminApp());
export const db=()=>getFirestore(adminApp());
