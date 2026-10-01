import type { PrismaClient } from "../../../../generated/prisma/client.ts";
import { prisma as prismaClient } from "./prisma.client.ts";
import type { AforoDia, VentaPorDia } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

// Columna @db.Date: Prisma la entrega como Date a medianoche UTC.
const formatearFecha = (fecha: Date): string => fecha.toISOString().slice(0, 10);

const MAX_INT4 = 2_147_483_647;

// Implementación con Prisma (solo lectura sobre dias y boletas).
export class PrismaReportesRepository implements ReportesRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  async obtenerVentasPorDia(): Promise<VentaPorDia[]> {
    const [dias, ventas] = await Promise.all([
      this.prisma.dias.findMany({
        select: { id: true, nombre: true, fecha: true },
        orderBy: [{ fecha: "asc" }, { id: "asc" }],
      }),
      this.prisma.boletas.groupBy({
        by: ["dia_id"],
        where: { state: "ACTIVE" },
        _count: { _all: true },
        _sum: { precio: true },
      }),
    ]);

    const ventasPorDia = new Map(ventas.map((v) => [v.dia_id, v]));

    // Los días sin boletas activas aparecen con 0 boletas y 0 ingresos.
    return dias.map((dia) => {
      const venta = ventasPorDia.get(dia.id);
      return {
        dia_id: dia.id,
        nombre: dia.nombre,
        fecha: formatearFecha(dia.fecha),
        boletas: venta?._count._all ?? 0,
        ingresos: venta?._sum.precio ?? 0,
      };
    });
  }

  async obtenerAforoDia(diaId: number): Promise<AforoDia | null> {
    // dias.id es INTEGER: un id mayor no puede existir (y Prisma fallaría al enviarlo).
    if (diaId > MAX_INT4) return null;

    const [dia, vendidas] = await Promise.all([
      this.prisma.dias.findUnique({ where: { id: diaId }, select: { id: true, aforo: true } }),
      this.prisma.boletas.count({ where: { dia_id: diaId, state: "ACTIVE" } }),
    ]);
    if (!dia) return null;

    return { dia_id: dia.id, aforo: dia.aforo, vendidas };
  }
}
