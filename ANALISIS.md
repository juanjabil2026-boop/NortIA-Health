# Análisis del proyecto importado

Revisión: 8 de septiembre de 2026. Frontend React 19, TypeScript, Vite, Tailwind CSS 4 y Lucide. Puede desplegarse como demo estática. El ZIP no contiene servidor, autenticación ni base de datos. La documentación anterior se conserva como planificación.

## Funcionalidad encontrada

| Módulo | Implementación |
| --- | --- |
| Agenda | Por médico, creación manual, estados, bloqueos y reservas en memoria/localStorage |
| WhatsApp | Simulador por palabras clave, sin Gemini, Evolution API o webhooks reales |
| Escalaciones | Bandeja y resolución local; no envía mensajes |
| Pacientes | Registro y búsqueda local |
| Inventario | Catálogo, lotes y movimientos FEFO locales |
| Servicios | Edición; algunas reglas son solo estado visual |
| Auditoría | Logs locales modificables; no son una bitácora inmutable |
| Roles | Selector visual sin autorización de servidor |

## Ajustes de importación

- Nombre nortia-health, versión 0.1.0, Node 22 y lockfile npm.
- Eliminadas dependencias sin uso (Gemini, Express, dotenv y motion); herramientas agrupadas en desarrollo.
- README actualizado, guía de despliegue y configuración Netlify.
- Eliminada solicitud de API key innecesaria.
- Contactos e identificadores de ejemplo reemplazados por datos ficticios.
- Aviso visible de demostración.
- Confirmación de reservas comprueba vencimiento.
- Registro automático deja consentimiento pendiente.
- Reinicio limitado a claves nortia_, sin borrar datos ajenos del mismo origen.
- Inventario copia lotes antes de modificarlos y rechaza cantidades no positivas o no finitas.

## Pendientes antes de producción

| Prioridad | Hallazgo | Trabajo requerido |
| --- | --- | --- |
| Alta | Datos de salud en localStorage; sin login o permisos reales | Core, autenticación, tenants y persistencia segura |
| Alta | Reservas no transaccionales entre usuarios; cita manual no verifica todos los locks | Disponibilidad y confirmación atómicas en backend |
| Alta | FEFO no excluye lotes vencidos; entradas usan costo y caducidad de ejemplo | Stock dispensable y trazabilidad real por lote |
| Alta | WhatsApp y handoff son simulados | Gateway, webhooks, canal real y supervisión humana |
| Media | TTL y antelación del panel no se guardan ni gobiernan el motor; buffers inconsistentes | Centralizar reglas |
| Media | JSON.parse sin recuperación ante datos corruptos y sin manejo de cuota | Migración y manejo de errores |
| Media | Fecha fija e IDs Date.now | Diseño de fechas e identificadores en Core |
| Media | Sin manifest o service worker | Implementar capacidades PWA si se requieren |

Las etiquetas de gateway, API, IA y auditoría de la interfaz representan una simulación. La demo no debe utilizarse para atención o dispensación reales. Esta importación no reconstruye el backend.

## Verificación

- npm run lint: pasó.
- npm run build: pasó.
- npm audit --omit=dev: cero vulnerabilidades reportadas en esta revisión.
- Navegación de los siete módulos y resolución de un caso ficticio verificadas en navegador; persistencia confirmada tras recargar. Sin errores de consola en la navegación revisada.

Se publica el código fuente preparado; se excluyen node_modules, dist, secretos y archivos de sesión.


