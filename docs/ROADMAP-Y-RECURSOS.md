# Roadmap, esfuerzo y recursos

> Estimaciones de los documentos aportados; no vinculantes. No representan trabajo ejecutado, tarifas vigentes verificadas ni presupuesto aprobado. Los días son relativos al arranque, cuya fecha no está fijada.

## Primeros 30 días

| Periodo | Foco | Hito |
| --- | --- | --- |
| Semana 1 / día 7 | Foundation | Repositorio, ambientes, DB, auth base, tenants, roles, CI/CD y primer deploy |
| Semana 2 / día 14 | Pacientes y agenda | Paciente, responsable, servicio, disponibilidad, bloqueos y cita desde panel |
| Semana 3 / día 21 | WhatsApp e IA | Integración, agente administrativo y escalamiento con casos reales |
| Semana 4 / día 30 | Panel y piloto | Uso controlado con cliente cero, auditoría, KPIs y bitácora de ajustes |

Las cuatro semanas son una meta de planificación. Su viabilidad depende del alcance y la dedicación efectiva del equipo.

## Evolución propuesta en la presentación

| Etapa | Horizonte | Alcance |
| --- | --- | --- |
| Concierge | Mes 1 | WhatsApp, agenda y panel |
| Continuidad | Mes 2 | Recordatorios, retorno y tareas |
| Clínica | Meses 3–4 | Multiagenda y recursos |
| Inventario | Meses 4–5 | Medicamentos y vacunas |
| Inteligencia | Posterior | Analítica y automatización |

Los recordatorios básicos ya aparecen en el MVP técnico. La etapa de continuidad debe interpretarse como ampliación, pendiente de confirmar.

## Horas por módulo

| # | Módulo | Horas | Recurso | Prioridad en la fuente |
| --- | --- | --- | --- | --- |
| 0 | Foundation técnica | 45–70 | Tech Lead + Full-stack | Crítico |
| 1 | Auth, tenant, roles y auditoría | 55–85 | Tech Lead | Crítico |
| 2 | Pacientes y responsables | 45–70 | Full-stack | Crítico |
| 3 | Servicios y reglas | 50–80 | Tech Lead + Product | Crítico |
| 4 | Agenda y disponibilidad | 80–120 | Tech Lead | Crítico |
| 5 | WhatsApp + Evolution API | 55–90 | Automation + Backend | Crítico |
| 6 | Agente IA administrativo | 70–110 | AI builder + Product | Crítico |
| 7 | Panel operativo PWA | 90–140 | Full-stack | Crítico |
| 8 | n8n workflows | 45–80 | Automation | Alto |
| 9 | Pagos/prepago | 45–75 | Backend + Integración | Alto |
| 10 | Seguimiento básico | 55–90 | Full-stack + Automation | Alto |
| 11 | KPIs y dashboard | 40–70 | Full-stack | Medio |
| 12 | Multiagenda/multimédico | 70–110 | Tech Lead | Fase 2 |
| 13 | Inventario clínico | 90–150 | Full-stack + Dominio | Fase 3 |
| 14 | Hardening seguridad | 60–100 | Tech Lead + QA | Transversal |

El hardening es transversal; las medidas de seguridad básicas comienzan desde foundation.

## Diferencias en las estimaciones

| Referencia | Rango |
| --- | --- |
| Resumen del documento para MVP 0–8 | 485–775 h |
| **Suma aritmética de las filas 0–8** | **535–845 h** |
| Escenario recortado del documento | 300–420 h |
| Total acumulado Linda Vista indicado en el documento | 750–1.150 h |
| Suma aritmética de todos los módulos 0–14 | 895–1.440 h |

La suma del MVP supera el resumen en 50–70 horas. El escenario recortado no trae desglose que permita reconciliarlo. El total de Linda Vista tampoco especifica qué módulos incluye o solapa; no debe equipararse automáticamente con la suma completa.

Las horas se describen como construcción asistida por IA, con implementación, revisión, pruebas básicas y documentación. No incluyen compra de dominios, diseño de marca externo ni tarifas variables de WhatsApp Business o pasarela.

## Presupuesto mensual de referencia del documento

| Escenario | Rango USD/mes | Supuesto del documento |
| --- | --- | --- |
| MVP austero | 90–180 | Infraestructura básica, n8n self-host y uso moderado de IA |
| MVP recomendado | 220–450 | Planes de equipo, herramientas IA, automatización y backups |
| Piloto con margen | 450–900 | Más cuota IA, monitoreo, ambientes separados y tráfico |

Estos escenarios mezclan infraestructura del producto y herramientas de desarrollo. No son un cálculo de costo total ni una cotización. Falta separar mano de obra, servicios de producción, herramientas personales, impuestos y consumo variable.

## Referencias de herramientas en la fuente

El documento cita Railway, Netlify, Cloudflare, n8n, Evolution API, GitHub, Copilot, ChatGPT, Claude y APIs de modelos. Sus precios individuales no se adoptan aquí como tarifas actuales. Antes de contratar, confirmar moneda, país, impuestos, plan y uso.

Fuentes citadas por el documento: [Railway](https://docs.railway.com/pricing), [Netlify](https://www.netlify.com/pricing/), [Cloudflare Workers](https://developers.cloudflare.com/workers/platform/pricing/), [n8n](https://n8n.io/pricing/), [GitHub](https://github.com/pricing), [Copilot](https://docs.github.com/en/copilot/get-started/plans), [ChatGPT](https://openai.com/es-ES/chatgpt/pricing/) y [Claude](https://claude.com/pricing). Enlaces transcritos de la fuente, sin verificación de precios en esta entrega.

Fuentes: plan de desarrollo, secciones 2–9; plan operativo, sección 6; presentación, diapositiva 8.

