# Mini Tienda — API

API Next.js (Node runtime), Firebase Auth por REST, Firebase Admin/Firestore, validación Zod, pedidos transaccionales y Vercel Blob.

## Configuración

1. Node 22, `npm install`, `npm run check`, `npm test`.
2. Crea Firebase, habilita **Authentication → Email/Password**, Firestore en producción y aplica `firestore.rules` (clientes denegados) e índices de `firestore.indexes.json`.
3. Crea cuenta de servicio y clave web Firebase. **No copies ninguna clave al repositorio**.
4. Crea proyecto Vercel y Blob público. Configura solo en variables de Vercel: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_WEB_API_KEY`, `BLOB_READ_WRITE_TOKEN`.
5. `FIREBASE_PRIVATE_KEY` puede contener `\\n` literales, que el servidor transforma al iniciar.
6. Despliega `vercel deploy --prod` después de revisar y autorizar el despliegue. Comprueba `/api/health`.
7. **Una sola vez**, con credenciales de backend en entorno seguro, ejecuta `npm run seed` para importar 40 productos de DummyJSON; no ejecutes continuamente.

## Endpoints

- `POST /api/auth/registro`, `/login`, `/refresh`; `GET /api/auth/yo`.
- `GET /api/productos` con Bearer; `PUT /api/productos?id=UUID` solo admin.
- `GET/POST /api/pedidos` (en POST, UUID, items con producto_id y cantidad, direccion nullable). Precio y stock se calculan en Firestore dentro de una transacción.
- `GET /api/favoritos`, `/api/carrito`, `PUT/DELETE /api/{recurso}/{id}` privados y con borrado lógico.
- `POST /api/imagenes` imagen binaria bajo 4 MB; `DELETE /api/imagenes?url=...` solo imágenes del propio usuario.

## Seguridad y limitaciones

No se usan tarjetas ni pagos reales. Recomendado activar rate limiting para login en Vercel Firewall. Imágenes Blob públicas. Para asignar admin, desde un script seguro con Admin SDK: `getAuth().setCustomUserClaims(uid,{rol:'admin'})`. Nunca aceptes rol del cliente.

Los cambios remotos se sincronizan con marca `updated_at`; para paginación exacta bajo marcas de tiempo idénticas, extender cursor a `(updated_at, document_id)` antes de alto volumen.

## Pruebas

`npm test` contiene autenticación 401, validación 400, autorización 403 y transacción 409 sin escrituras. Evidencia de restricciones: `ia/`. Los comandos ejecutados y resultados reales deben registrarse.
