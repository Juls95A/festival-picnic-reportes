import "dotenv/config";
import express from "express";
import cors from "cors";
import { reportesRouter } from "./modules/reportes/interface/reportes.routes.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/reportes", reportesRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
