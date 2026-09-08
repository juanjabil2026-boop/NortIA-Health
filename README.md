# NortIA Health

Plataforma modular de operación clínica de **NortIAcreative**, con WhatsApp como primer canal y un Core propio para pacientes, responsables, agenda, reglas y auditoría.

La primera entrega propuesta, **NortIA Health Concierge**, busca reducir carga administrativa, captar contactos fuera de horario y ordenar las citas. Amalia es la cliente cero prevista para validar el producto; Linda Vista representa la expansión futura hacia varias agendas y recursos.

> **Estado:** documentación inicial de producto y planificación, basada en tres documentos aportados por el propietario. El repositorio no contiene todavía la implementación del sistema. Plazos, stack y presupuestos son propuestas, no resultados ni compromisos aprobados.

## Problema y propuesta

Los mensajes, confirmaciones y cambios de agenda concentran trabajo repetitivo en pocas personas. NortIA Health propone atención administrativa por WhatsApp, un panel para la asistente y una base operativa compartida con el médico.

La IA conversa y clasifica intenciones. **El Core decide disponibilidad, reglas, estados y permisos.** Los casos sensibles, ambiguos o con señales de alarma escalan a una persona; la IA no diagnostica ni sustituye al médico.

## Primera entrega: Concierge

- Identificación de pacientes nuevos y recurrentes, con responsables o tutores.
- Servicios, horarios, duración de consultas, bloqueos y reglas configurables.
- Agenda, reagenda y cancelación, con protección contra reservas duplicadas.
- WhatsApp, trazabilidad de mensajes y escalamiento humano.
- PWA con agenda del día, inbox, ficha operativa, tareas y configuración.
- Recordatorios y confirmaciones mediante automatizaciones.
- Roles, auditoría y medición básica del piloto.

El prepago entra al MVP si se confirma como requisito indispensable. Multiagenda e inventario pertenecen a fases posteriores.

## Flujo previsto

1. El paciente o responsable escribe por WhatsApp.
2. Se identifica y clasifica el contacto.
3. El Core consulta reglas y disponibilidad.
4. Se registra una cita confirmada o pendiente según las reglas aplicables.
5. La operación recibe excepciones y tareas que requieren intervención humana.
6. Se registran eventos para auditoría y medición.

## Documentación

| Documento | Contenido |
| --- | --- |
| [Producto y alcance](docs/PRODUCTO.md) | Usuarios, MVP, límites y criterios de validación |
| [Arquitectura propuesta](docs/ARQUITECTURA.md) | Core, IA, n8n, PWA e integraciones |
| [Plan operativo](docs/OPERACION.md) | Equipo, cadencia, definición de terminado y riesgos |
| [Roadmap y estimaciones](docs/ROADMAP-Y-RECURSOS.md) | Hitos, módulos, horas y presupuestos de referencia |
| [Fuentes y decisiones pendientes](docs/FUENTES-Y-DECISIONES.md) | Trazabilidad, diferencias entre documentos y asuntos por resolver |

## Stack propuesto

Monolito modular API-first, PostgreSQL y PWA responsive. Railway para API, workers y base de datos; Netlify para frontend; n8n para orquestación; Evolution API como gateway de WhatsApp; Cloudflare para protección perimetral. Son recomendaciones de los documentos, pendientes de validación técnica y contratación.

## Validación del piloto

La propuesta contempla cuatro semanas y una evaluación al día 30 mediante conversión de contacto a cita, automatización, tiempo ahorrado, inasistencias y captación fuera de horario. Falta fijar línea base y metas cuantitativas.

## Cómo empezar

Leer el alcance y las decisiones pendientes; confirmar reglas del consultorio, equipo y capacidad; después preparar la foundation técnica. Todavía no existen comandos de instalación, variables de entorno ni instrucciones de despliegue verificadas.

El plan operativo recomienda repositorio privado, ramas protegidas y revisión por PR. El repositorio se encontró público al documentarlo el 8 de septiembre de 2026; la visibilidad y esas protecciones requieren una decisión independiente.

## Procedencia

Síntesis de la presentación ejecutiva para Amalia, el plan operativo interno y el plan de desarrollo, horas y recursos. Ver [fuentes](docs/FUENTES-Y-DECISIONES.md). Las recomendaciones de esos archivos se registran como propuestas del proyecto.

