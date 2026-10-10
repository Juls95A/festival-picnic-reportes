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

## Pruebas

Con el servidor en ejecución, abre otra terminal y ejecuta las pruebas públicas del módulo:

```bash
node pruebas/correr.mjs reportes http://localhost:3000
```

Las pruebas públicas verifican el comportamiento de los endpoints, incluyendo validaciones de parámetros y el ranking de productos de comida.

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

Durante la implementación del endpoint de top de productos de comida se ejecutó el comando:

```bash
npx tsc --noEmit
```

La comprobación terminó sin errores. También se ejecutaron las pruebas públicas de Reportes y se obtuvo un resultado de **9/9 pruebas aprobadas**.

## Contratos del proyecto

Los contratos específicos de los módulos y las convenciones comunes se encuentran en la carpeta `contratos/`. Este módulo sigue el contrato definido en `contratos/12-reportes.md` y las reglas generales de `contratos/CONVENCIONES.md`.