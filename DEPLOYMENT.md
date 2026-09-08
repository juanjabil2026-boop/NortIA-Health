# Despliegue desde GitHub

Versión de demostración estática, con datos ficticios guardados por navegador. No incluye API, WhatsApp real, login ni persistencia compartida.

## Netlify

Importar el repositorio desde GitHub y seleccionar main. El archivo netlify.toml define:

| Ajuste | Valor |
| --- | --- |
| Directorio base | Raíz |
| Comando | npm run lint && npm run build |
| Publicación | dist |
| Node | 22 |
| Variables de entorno | Ninguna |
| Fallback SPA | /* hacia /index.html |

La conexión del repositorio permite configurar builds ante nuevos commits. Esta importación no crea un sitio ni ejecuta un despliegue. No colocar secretos de proveedores en variables VITE_: serían accesibles desde el frontend.

## Verificación local

```sh
npm ci
npm run lint
npm run build
npm run preview
```

Comprobar módulos, agenda y persistencia tras recargar. La fecha inicial es 2026-09-08 para los escenarios de ejemplo.

## Otros hosts

Publicar dist con los mismos comandos y fallback SPA donde corresponda. Railway y el Core del plan siguen pendientes; no son necesarios para ejecutar esta demo.

Consultar [ANALISIS.md](ANALISIS.md) para las limitaciones antes de operar con pacientes reales.

