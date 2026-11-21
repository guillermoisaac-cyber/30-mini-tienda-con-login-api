import { z } from 'zod';
export const credentials=z.object({email:z.email(),password:z.string().min(8)}).strict();
export const refresh=z.object({refreshToken:z.string().min(10)}).strict();
export const uuid=z.uuid();
export const orderInput=z.object({id:uuid,items:z.array(z.object({producto_id:z.string().min(1),cantidad:z.number().int().min(1).max(10)}).strict()).min(1).max(100),direccion:z.string().trim().max(350).nullable().default(null)}).strict();
export const itemInput=z.object({producto_id:z.string().min(1),cantidad:z.number().int().min(1).max(10)}).strict();
export const favoritoInput=z.object({producto_id:z.string().min(1)}).strict();
export const productInput=z.object({nombre:z.string().min(1),precio_centavos:z.number().int().nonnegative(),categoria:z.string().min(1),imagen_url:z.url().nullable(),stock:z.number().int().nonnegative()}).strict();
