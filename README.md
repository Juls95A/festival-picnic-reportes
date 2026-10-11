# Festival Picnic 2026 — Módulo de Reportes

## Descripción

El módulo de Reportes proporciona consultas de solo lectura para apoyar el seguimiento y análisis de la información del Festival Picnic 2026. Reúne información de diferentes módulos mediante consultas a la base de datos compartida.

El módulo está desarrollado con Node.js, Express, TypeScript y Prisma, siguiendo una arquitectura organizada en cuatro capas: dominio, aplicación, infraestructura e interfaz.

## Funcionalidades

El módulo ofrece los siguientes reportes:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/reportes/ventas-por-dia` | Consulta las boletas vendidas y los ingresos por día, incluyendo días sin ventas. |
| GET | `/api/reportes/top-artistas?limit=3` | Consulta el ranking de artistas por promedio de reseñas. |
| GET | `/api/reportes/ocupacion/:diaId` | Consulta el aforo, las boletas vendidas y el porcentaje de ocupación de un día. |
| GET | `/api/reportes/escenarios/:escenarioId/agenda?dia_id=1` | Consulta los shows de un escenario para un día específico. |
| GET | `/api/reportes/comida/top-productos` | Consulta los productos de comida con pedidos activos, ordenados por unidades vendidas. |

Todos los endpoints son de solo lectura y devuelven sus resultados dentro de la propiedad `data`.

## Arquitectura

El módulo utiliza cuatro capas:

- **Domain:** define las entidades, los tipos de los reportes, la interfaz del repositorio y los errores del dominio.
- **Application:** contiene los casos de uso y las reglas de negocio.
- **Infrastructure:** implementa el acceso de solo lectura a la base de datos mediante Prisma.
- **Interface:** contiene las rutas HTTP, los controladores y el manejador de errores.

Los casos de uso dependen de la interfaz del repositorio y no directamente de Prisma.

## Integrantes y aportes

- **Integrante 1 — Juliana Álvarez:** preparación y configuración inicial del proyecto, construcción de la arquitectura base de Reportes y desarrollo de la primera parte funcional del módulo.
- **Integrante 2 — Sara Moncada:** desarrollo de la segunda parte del módulo de Reportes, incluyendo los casos de uso, consultas y endpoints asignados.
- **Integrante 3 — María José Hincapié:** finalización e integración del módulo, implementación del reporte de productos de comida, validaciones de parámetros, verificación de endpoints, pruebas públicas y documentación final.

## Regla de negocio: productos de comida más vendidos

El reporte considera los pedidos y productos que tienen el estado `ACTIVE`. Agrupa las cantidades por producto, calcula las unidades vendidas y los ingresos, y ordena los resultados de mayor a menor según las unidades vendidas.

**Archivo de implementación:** `src/modules/reportes/infrastructure/prisma-reportes.repository.ts`.

**Cómo se probó:** se ejecutó `node pruebas/correr.mjs reportes http://localhost:3000`. Las nueve pruebas públicas pasaron, incluida la prueba que verifica el orden de los productos por unidades vendidas.

## Base de datos

El módulo consulta tablas compartidas relacionadas con días, boletas, artistas, shows, reseñas, escenarios y pedidos y productos de comida.

**Importante:** este módulo no debe modificar las tablas compartidas ni los datos precargados. Para sincronizar el esquema local se utiliza el comando `npm run sync`. No se deben ejecutar `prisma migrate` ni `prisma db push`.

## Configuración y ejecución

### Requisitos

- Node.js 18 o superior.
- npm.
- Acceso a la base de datos PostgreSQL proporcionada para el proyecto.

### Variables de entorno

Configura el archivo `.env` en la raíz del proyecto con los valores correspondientes a tu entorno:

```env
DATABASE_URL="postgresql://..."
PORT=3000
```

No publiques las credenciales reales de la base de datos. El archivo `.env` debe mantenerse fuera del control de versiones.

### Instalar dependencias

```bash
npm install
```

### Sincronizar el esquema de Prisma

```bash
npm run sync
```

### Iniciar el servidor en desarrollo

```bash
npm run dev
```

Por defecto, el servidor utiliza el puerto `3000`, salvo que se configure otro mediante `PORT`.

Verificación de los endpoints desde la terminal

Para consultar las respuestas de los endpoints manualmente, primero inicia el servidor con npm run dev y deja esa terminal abierta.

Después, abre una segunda terminal de PowerShell en VS Code y ejecuta los siguientes comandos, uno por uno.

1. Ventas por día

Invoke-RestMethod "http://localhost:3000/api/reportes/ventas-por-dia"

2. Top de artistas

Consulta los tres artistas mejor calificados:

Invoke-RestMethod "http://localhost:3000/api/reportes/top-artistas?limit=3"

3. Ocupación de un día

Consulta la ocupación del día con ID 4:

Invoke-RestMethod "http://localhost:3000/api/reportes/ocupacion/4"

4. Agenda de un escenario

Consulta la agenda del escenario con ID 1 para el día con ID 1:

Invoke-RestMethod "http://localhost:3000/api/reportes/escenarios/1/agenda?dia_id=1"

5. Productos más vendidos de comida

Invoke-RestMethod "http://localhost:3000/api/reportes/comida/top-productos"

Los comandos anteriores muestran en PowerShell las respuestas devueltas por la API. También puedes abrir las mismas direcciones en el navegador, siempre que el servidor esté en ejecución.

Pruebas automatizadas

Con el servidor en ejecución, abre otra terminal y ejecuta las pruebas públicas del módulo:

node pruebas/correr.mjs reportes http://localhost:3000

Las pruebas públicas verifican el comportamiento de los endpoints, incluyendo las validaciones de parámetros y el ranking de productos de comida.

Para comprobar que el código TypeScript no tenga errores de tipos, también puedes ejecutar:

npx tsc --noEmit

## Ejemplo de respuesta: top de productos de comida

Solicitud:

```http
GET /api/reportes/comida/top-productos
```

Respuesta de ejemplo:

```json
{
  "data": [
    {
      "producto_id": 1,
      "nombre": "Arepa de choclo con queso",
      "unidades": 2,
      "ingresos": 24000
    },
    {
      "producto_id": 3,
      "nombre": "Salchipapa especial",
      "unidades": 1,
      "ingresos": 18000
    }
  ]
}
```

El reporte considera registros con `state = 'ACTIVE'`, agrupa las cantidades y los ingresos por producto y ordena los resultados por unidades vendidas de mayor a menor.

## Estado de verificación

Durante la implementación del endpoint de top de productos de comida se ejecutó el comando npx tsc --noEmit, que terminó sin errores.

También se ejecutaron las pruebas públicas del módulo Reportes y se obtuvo un resultado de 9/9 pruebas aprobadas.

El resultado documentado corresponde a la ejecución realizada durante el desarrollo. Puedes volver a ejecutar los comandos anteriores para verificar el estado actual del proyecto.

## Contratos del proyecto

Los contratos específicos de los módulos y las convenciones comunes se encuentran en la carpeta `contratos/`. Este módulo sigue el contrato definido en `contratos/12-reportes.md` y las reglas generales de `contratos/CONVENCIONES.md`.