import "express-async-errors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { logger } from "./configs/logger";
import pinoHttp from "pino-http";
import promClient from "prom-client";
import { env } from "./configs/environment";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { authenticateToken } from "./middleware/authMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./configs/swaggerConfig";

import authRoutes from "./routes/authRoutes";
import ocorrenciaRoutes from "./routes/ocorrenciaRoutes";
import userRoutes from "./routes/userRoutes";
import bairroRoutes from "./routes/bairroRoutes";
import naturezaRoutes from "./routes/naturezaRoutes";
import grupoRoutes from "./routes/grupoRoutes";
import subgrupoRoutes from "./routes/subgrupoRoutes";
import formaAcervoRoutes from "./routes/formaAcervoRoutes";
import grupamentoRoutes from "./routes/grupamentoRoutes";
import unidadeOperacionalRoutes from "./routes/unidadeOperacionalRoutes";
import viaturaRoutes from "./routes/viaturaRoutes";
import relatorioRoutes from "./routes/relatorioRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import municipioRoutes from "./routes/municipioRoutes";

if (process.env.NODE_ENV !== "test") {
  Sentry.init({
    dsn: env.sentry.dsn,
    enabled: process.env.NODE_ENV === "production",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Prisma(),
    ],
    tracesSampleRate: 1.0,
  });
}

if (process.env.NODE_ENV !== "test") {
  promClient.collectDefaultMetrics();
}

const app = express();
const PORT = env.port;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
io.on("connection", (socket: Socket) => {
  if (process.env.NODE_ENV !== "test") {
    logger.info(`Cliente conectado via Socket.io: ${socket.id}`);
  }
  socket.on("disconnect", () => {
    if (process.env.NODE_ENV !== "test") {
      logger.info(`Cliente desconectado: ${socket.id}`);
    }
  });
});

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

if (process.env.NODE_ENV !== "test") {
  app.use(pinoHttp({ logger }));
}

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.send(
    "API S.O.R.O. está funcionando! Acesse /api/docs para a documentação."
  );
});
app.use("/api/v1/auth", authRoutes);
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.use(authenticateToken);
app.use("/api/v2/dashboard", dashboardRoutes);
app.use("/api/v1/relatorios", relatorioRoutes);
app.use("/api/v2/ocorrencias", ocorrenciaRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v2/municipios", municipioRoutes);
app.use("/api/v2/bairros", bairroRoutes);
app.use("/api/v2/naturezas", naturezaRoutes);
app.use("/api/v2/grupos", grupoRoutes);
app.use("/api/v2/subgrupos", subgrupoRoutes);
app.use("/api/v2/formas-acervo", formaAcervoRoutes);
app.use("/api/v2/grupamentos", grupamentoRoutes);
app.use("/api/v2/unidades-operacionais", unidadeOperacionalRoutes);
app.use("/api/v2/viaturas", viaturaRoutes);

app.use(Sentry.Handlers.errorHandler());
app.use(errorMiddleware);

export default app;

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    logger.info(
      `Documentação da API disponível em http://localhost:${PORT}/api/docs`
    );
    logger.info(
      `Métricas do Prometheus disponíveis em http://localhost:${PORT}/metrics`
    );
  });
}
