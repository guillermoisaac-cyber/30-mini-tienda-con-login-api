# IA — API Mini Tienda

- Trabaja exclusivamente dentro de este repositorio; no leas `.env*`, credenciales, claves ni keystores.
- No ejecutes push, despliegues, escrituras remotas ni acciones con efectos fuera del equipo sin autorización expresa.
- Stack: Next.js App Router, TypeScript estricto, Firebase Admin, Zod, Vitest.
- Todas las rutas privadas verifican Firebase ID token; `uid` se obtiene del token, nunca del cuerpo.
- Los precios y el stock son decisiones exclusivas del servidor. Los pedidos requieren transacción.
- Nunca registres secretos, tokens o contraseñas; errores públicos sin trazas internas.
- Antes de confirmar cambios ejecuta `npm run check` y `npm test` y registra evidencia real en `ia/bitacora.md`.
- Estas instrucciones son normas de comportamiento, no un sandbox técnico: configura permisos del agente por separado.
