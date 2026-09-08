# Producto y alcance

## Visión

NortIA Health es un producto propio de NortIA, validado inicialmente con Amalia como cliente cero. La estrategia es comenzar con atención y agenda y reutilizar el mismo Core para continuidad, multiagenda, inventario e inteligencia operacional.

El valor esperado es menor carga manual, mayor captación y conversión, respuestas consistentes y control de cada interacción. Los documentos no aportan todavía resultados medidos.

## Usuarios y superficies previstas

| Usuario | Superficie | Uso |
| --- | --- | --- |
| Paciente o responsable | WhatsApp | Citas, confirmaciones y, según fase, pagos, formularios y seguimiento |
| Asistente / operación | Panel web PWA | Inbox, agenda, excepciones, tareas y configuración |
| Médico | Web / tablet | Agenda del día, ficha operativa, línea de tiempo y próximos pasos |
| Administración del producto | Configuración y auditoría | Servicios, horarios, reglas, usuarios y permisos |

La relación paciente-responsable es relevante para pacientes pediátricos. La deduplicación por teléfono aparece en el plan, pero debe definirse cómo distinguir a varios pacientes que comparten el número de un tutor.

## MVP propuesto

| Capacidad | Alcance |
| --- | --- |
| Foundation | Repositorio, ambientes, CI/CD, base de datos, secrets y logging |
| Identidad y acceso | Usuarios, tenants, roles, permisos y auditoría |
| Pacientes | Paciente, responsable, identificación e historial operativo |
| Servicios y reglas | Duraciones, tipos de consulta, horarios y reglas configurables |
| Agenda | Disponibilidad, bloqueos, reservas temporales, locks y estados de cita |
| WhatsApp | Recepción, envío, normalización y trazabilidad de mensajes |
| IA administrativa | Clasificación de intención, nuevo/recurrente, agenda, reagenda, cancelación y escalamiento |
| Panel | Agenda del día, inbox, ficha, estados, tareas y configuración básica |
| Automatización | Confirmaciones, recordatorios, alertas y reconciliación de eventos |

## Alcance condicionado o posterior

- **Pagos/prepago:** incorporar pago simple si el prepago de sábado es indispensable; proveedor y reglas pendientes.
- **Seguimiento:** acordar el mínimo del primer mes. El plan operativo lo menciona en el MVP, mientras que desarrollo lo separa como crecimiento y la presentación ubica continuidad en el mes 2.
- **KPIs:** medir el piloto desde el primer mes; el dashboard ampliado figura como módulo de crecimiento.
- **Multiagenda:** médicos, recursos, sucursales y agendas por proveedor.
- **Inventario:** medicamentos, vacunas, lotes, caducidades, movimientos y consumo asociado a paciente.
- **Inteligencia:** analítica y automatización posteriores.

El objetivo inicial no es un expediente clínico completo certificado. La documentación no especifica todavía una API de Doctoralia disponible ni un alcance aprobado para su integración.

## Límites de la IA

Automatiza tareas administrativas y clasifica intención, urgencia operativa y necesidad de intervención humana. Disponibilidad, reglas y permisos se resuelven en el Core. Los casos clínicos sensibles, ambiguos o con señales de alarma pasan al personal humano.

Se deben validar con el equipo clínico los mensajes y el protocolo de escalamiento antes de operar. Estos documentos no constituyen un protocolo clínico.

## Medición

Métricas mencionadas en la presentación, diapositiva 9:

- Conversión de contacto a cita.
- Porcentaje de operación autónoma.
- Minutos ahorrados.
- Inasistencias (no-show).
- Captación fuera de horario.

El plan de desarrollo añade canal y capacidad. **Propuesta de instrumentación documental:** definir evento de inicio y fin, denominador, ventana temporal y responsable de revisión para cada indicador. No existen metas numéricas ni línea base en las fuentes.

## Validación funcional propuesta

Estos casos se derivan del alcance para orientar futuras pruebas; no se han ejecutado:

1. Crear paciente y responsable, seleccionar servicio y reservar desde el panel.
2. Identificar un contacto nuevo o recurrente por WhatsApp.
3. Agendar, reagendar y cancelar respetando reglas del Core.
4. Rechazar reservas incompatibles cuando dos solicitudes compiten por un horario.
5. Escalar una excepción a operación y conservar trazabilidad.
6. Verificar roles, registro de cambios y recordatorios.

Fuentes: presentación ejecutiva, diapositivas 1–10; plan operativo, secciones 1–2 y 6–8; plan de desarrollo, secciones 1–5.

