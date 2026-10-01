import { Router } from "express";
import { ObtenerOcupacionDiaUseCase } from "../application/obtener-ocupacion-dia.use-case.ts";
import { ObtenerVentasPorDiaUseCase } from "../application/obtener-ventas-por-dia.use-case.ts";
import { PrismaReportesRepository } from "../infrastructure/prisma-reportes.repository.ts";
import { ReportesController } from "./reportes.controller.ts";
import { reportesErrorHandler } from "./reportes.error-handler.ts";

const repository = new PrismaReportesRepository();
const controller = new ReportesController(
  new ObtenerVentasPorDiaUseCase(repository),
  new ObtenerOcupacionDiaUseCase(repository),
);

export const reportesRouter = Router();

reportesRouter.get("/ventas-por-dia", controller.ventasPorDia);
reportesRouter.get("/ocupacion/:diaId", controller.ocupacion);

reportesRouter.use(reportesErrorHandler);
