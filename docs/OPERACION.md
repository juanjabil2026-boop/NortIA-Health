# Plan operativo

> Modelo de trabajo propuesto en septiembre de 2026. Las capacidades indicadas no confirman contrataciones ni asignaciones activas.

## Equipo mínimo

| Rol | Capacidad propuesta | Responsabilidad |
| --- | --- | --- |
| Product Owner | Juan / socio líder | Priorizar alcance, validar con cliente cero y resolver negocio |
| Tech Lead | 1 | Arquitectura, base de datos, seguridad, revisión y despliegues |
| Full-stack builder | 1 | PWA, API y panel |
| Automation engineer | Parcial | n8n, Evolution API, webhooks y recordatorios |
| Clinical workflow advisor | Amalia / asistente | Reglas reales, mensajes, excepciones y seguridad clínica |
| QA operativo | Parcial | Casos end-to-end, regresión y matriz de pruebas |

## Cadencia

Lunes: planeación. Miércoles: demo interna. Viernes: demo funcional y retrospectiva. El plan recomienda tickets de 4–8 horas, asistencia de Claude/Codex y revisión humana antes de merge.

Cada módulo debe contar con especificación breve, modelo de datos, endpoints, pruebas, pantalla o flujo n8n y checklist de seguridad.

## Definición de terminado de las fuentes

- Funciona en staging y producción.
- Tiene pruebas mínimas de flujo feliz, error y excepción.
- Incluye logs, auditoría y rollback claro.
- No expone datos sensibles innecesarios a la IA.
- Está documentado en GitHub y se puede explicar a socios en menos de cinco minutos.

Estos criterios se aplicarán a entregables futuros; esta publicación solo documenta el plan.

## Riesgos identificados

| Riesgo | Nivel de la fuente | Mitigación propuesta |
| --- | --- | --- |
| Doctoralia sin API completa | Alto | Canal externo y reconciliación manual/semiautomática |
| Double booking | Alto | Motor de disponibilidad, locks y reservas temporales |
| n8n expuesto | Medio/alto | Autenticación, protección perimetral, allowlist cuando aplique y actualizaciones |
| Exceso de alcance | Alto | Congelar MVP y resolver qué seguimiento mínimo incluye |
| Datos de salud | Alto | RBAC, auditoría, consentimiento, backups y mínimo contexto a IA |

## Gobierno del repositorio

El plan recomienda repositorio privado, ramas protegidas, PR obligatorio y secrets externos. Al preparar esta documentación el repositorio era público y solo contenía un README inicial. Esta entrega no cambia visibilidad, permisos ni reglas de ramas.

Registrar decisiones de alcance y arquitectura con motivo, responsable y fecha; esta es una propuesta documental para mantener trazabilidad. Los documentos de entrada no autorizan por sí mismos despliegues, compras ni cambios de acceso.

## Preparación del piloto

Confirmar reglas de servicios y horarios, protocolo de escalamiento, mínimos de datos y consentimiento, ambiente de pruebas, responsable operativo y métricas. Antes de go-live, validar casos reales controlados, recuperación y rollback.

Fuente principal: plan operativo interno, secciones 3–8.

