# Bitácora IA

| Propósito | Evidencia | Validación | Decisión |
|---|---|---|---|
| Definir límites de IA | AGENTS.md, .gitignore, .githooks | Probar el rechazo de un `.pem` preparado para Git | Mantener secretos fuera de los commits |

Registrar fechas y resultados reales de pruebas y despliegues a medida que se ejecuten.

## Ejecuciones verificadas en entorno de desarrollo

- `npm run check`: aprobado (TypeScript).
- `npm test`: 5 pruebas aprobadas (rutas y transacción de pedido).
- `npm run build`: aprobado (Next.js 15.5).
- Prueba negativa: archivo **ficticio** `prueba.pem` preparado con `git add -f` → el verificador salió con error y mostró `Secretos preparados para Git: ['prueba.pem']`.
- Tras retirar la prueba del índice: `PASS: no hay archivos secretos preparados para Git`.
- Sandbox de asistente, Firebase, Vercel y autenticación reales: **pendientes de comprobar en cuentas propias**.
