import type { PrismaClient } from "../../../../generated/prisma/client.ts";
import { prisma as prismaClient } from "./prisma.client.ts";
import { ReporteNoImplementadoError } from "../domain/reportes.errors.ts";
import type { OcupacionDia, VentaPorDia } from "../domain/reportes.entities.ts";
import type { ReportesRepository } from "../domain/reportes.repository.ts";

// Implementación con Prisma (solo lectura sobre dias y boletas).
// Las consultas se desarrollan en el Paso 3.
export class PrismaReportesRepository implements ReportesRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  async obtenerVentasPorDia(): Promise<VentaPorDia[]> {
    throw new ReporteNoImplementadoError("ventas-por-dia");
  }

  async obtenerOcupacionDia(_diaId: number): Promise<OcupacionDia | null> {
    throw new ReporteNoImplementadoError("ocupacion");
  }
}
