import { Router } from "express";
import { ObtenerAgendaEscenarioUseCase } from "../application/obtener-agenda-escenario.use-case.ts";
import { ObtenerOcupacionDiaUseCase } from "../application/obtener-ocupacion-dia.use-case.ts";
import { ObtenerTopArtistasUseCase } from "../application/obtener-top-artistas.use-case.ts";
import { ObtenerVentasPorDiaUseCase } from "../application/obtener-ventas-por-dia.use-case.ts";
import { PrismaReportesRepository } from "../infrastructure/prisma-reportes.repository.ts";
import { ReportesController } from "./reportes.controller.ts";
import { reportesErrorHandler } from "./reportes.error-handler.ts";

const repository = new PrismaReportesRepository();
const controller = new ReportesController(
  new ObtenerVentasPorDiaUseCase(repository),
  new ObtenerOcupacionDiaUseCase(repository),
  new ObtenerTopArtistasUseCase(repository),
  new ObtenerAgendaEscenarioUseCase(repository),
);

export const reportesRouter = Router();

reportesRouter.get("/ventas-por-dia", controller.ventasPorDia);
reportesRouter.get("/ocupacion/:diaId", controller.ocupacion);
reportesRouter.get("/top-artistas", controller.topArtistas);
reportesRouter.get("/escenarios/:escenarioId/agenda", controller.agendaEscenario);

reportesRouter.use(reportesErrorHandler);
