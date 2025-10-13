/*
  Warnings:

  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA');

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id_ocorrencia" TEXT NOT NULL,
    "nr_aviso" TEXT,
    "data_acionamento" TIMESTAMP(3) NOT NULL,
    "hora_acionamento" TIMESTAMP(3) NOT NULL,
    "status_situacao" "Status" NOT NULL DEFAULT 'ABERTA',
    "carimbo_data_hora_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_execucao_servico" TIMESTAMP(3),
    "relacionado_eleicao" BOOLEAN DEFAULT false,
    "id_subgrupo_fk" TEXT NOT NULL,
    "id_municipio_fk" TEXT NOT NULL,
    "id_forma_acervo_fk" TEXT NOT NULL,
    "id_usuario_abertura_fk" TEXT NOT NULL,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id_ocorrencia")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nome_guerra" TEXT,
    "posto_grad" TEXT,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo_perfil" "Profile" NOT NULL DEFAULT 'ANALISTA',
    "id_unidade_operacional_fk" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupamentos" (
    "id_grupamento" TEXT NOT NULL,
    "nome_grupamento" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "grupamentos_pkey" PRIMARY KEY ("id_grupamento")
);

-- CreateTable
CREATE TABLE "unidades_operacionais" (
    "id_unidade" TEXT NOT NULL,
    "nome_unidade" TEXT NOT NULL,
    "endereco_base" TEXT,
    "id_grupamento_fk" TEXT NOT NULL,

    CONSTRAINT "unidades_operacionais_pkey" PRIMARY KEY ("id_unidade")
);

-- CreateTable
CREATE TABLE "viaturas" (
    "id_viatura" TEXT NOT NULL,
    "tipo_vt" TEXT NOT NULL,
    "numero_viatura" TEXT NOT NULL,
    "id_unidade_operacional_fk" TEXT NOT NULL,

    CONSTRAINT "viaturas_pkey" PRIMARY KEY ("id_viatura")
);

-- CreateTable
CREATE TABLE "naturezas" (
    "id_natureza" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "naturezas_pkey" PRIMARY KEY ("id_natureza")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id_grupo" TEXT NOT NULL,
    "descricao_grupo" TEXT NOT NULL,
    "id_natureza_fk" TEXT NOT NULL,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "subgrupos" (
    "id_subgrupo" TEXT NOT NULL,
    "descricao_subgrupo" TEXT NOT NULL,
    "id_grupo_fk" TEXT NOT NULL,

    CONSTRAINT "subgrupos_pkey" PRIMARY KEY ("id_subgrupo")
);

-- CreateTable
CREATE TABLE "formas_acervo" (
    "id_forma_acervo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "formas_acervo_pkey" PRIMARY KEY ("id_forma_acervo")
);

-- CreateTable
CREATE TABLE "municipios" (
    "id_municipio" TEXT NOT NULL,
    "nome_municipio" TEXT NOT NULL,
    "regiao" TEXT,
    "ais" TEXT,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "localizacoes_ocorrencias" (
    "id_ocorrencia_fk" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "tipo_logradouro" TEXT,
    "logradouro" TEXT,
    "numero_km" TEXT,
    "referencia_logradouro" TEXT,

    CONSTRAINT "localizacoes_ocorrencias_pkey" PRIMARY KEY ("id_ocorrencia_fk")
);

-- CreateTable
CREATE TABLE "vitimas" (
    "id_vitima" TEXT NOT NULL,
    "nome_vitima" TEXT,
    "idade" INTEGER,
    "classificacao_vitima" TEXT,
    "destino_vitima" TEXT,
    "lesoes_json" JSONB,
    "id_ocorrencia_fk" TEXT NOT NULL,

    CONSTRAINT "vitimas_pkey" PRIMARY KEY ("id_vitima")
);

-- CreateTable
CREATE TABLE "midias" (
    "id_midia" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "url_caminho" TEXT NOT NULL,
    "data_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_ocorrencia_fk" TEXT NOT NULL,
    "id_usuario_upload_fk" TEXT NOT NULL,

    CONSTRAINT "midias_pkey" PRIMARY KEY ("id_midia")
);

-- CreateTable
CREATE TABLE "ocorrencias_viaturas" (
    "id_ocorrencia_fk" TEXT NOT NULL,
    "id_viatura_fk" TEXT NOT NULL,
    "horario_saida_quartel" TIMESTAMP(3),
    "horario_chegada_local" TIMESTAMP(3),
    "horario_saida_local" TIMESTAMP(3),

    CONSTRAINT "ocorrencias_viaturas_pkey" PRIMARY KEY ("id_ocorrencia_fk","id_viatura_fk")
);

-- CreateTable
CREATE TABLE "ocorrencias_equipes" (
    "id_ocorrencia_fk" TEXT NOT NULL,
    "id_viatura_fk" TEXT NOT NULL,
    "matricula_usuario_fk" TEXT NOT NULL,
    "funcao_na_equipe" TEXT,

    CONSTRAINT "ocorrencias_equipes_pkey" PRIMARY KEY ("id_ocorrencia_fk","id_viatura_fk","matricula_usuario_fk")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "grupamentos_sigla_key" ON "grupamentos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "viaturas_numero_viatura_key" ON "viaturas"("numero_viatura");

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_id_subgrupo_fk_fkey" FOREIGN KEY ("id_subgrupo_fk") REFERENCES "subgrupos"("id_subgrupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_id_municipio_fk_fkey" FOREIGN KEY ("id_municipio_fk") REFERENCES "municipios"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_id_forma_acervo_fk_fkey" FOREIGN KEY ("id_forma_acervo_fk") REFERENCES "formas_acervo"("id_forma_acervo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_id_usuario_abertura_fk_fkey" FOREIGN KEY ("id_usuario_abertura_fk") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_unidade_operacional_fk_fkey" FOREIGN KEY ("id_unidade_operacional_fk") REFERENCES "unidades_operacionais"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_operacionais" ADD CONSTRAINT "unidades_operacionais_id_grupamento_fk_fkey" FOREIGN KEY ("id_grupamento_fk") REFERENCES "grupamentos"("id_grupamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viaturas" ADD CONSTRAINT "viaturas_id_unidade_operacional_fk_fkey" FOREIGN KEY ("id_unidade_operacional_fk") REFERENCES "unidades_operacionais"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_id_natureza_fk_fkey" FOREIGN KEY ("id_natureza_fk") REFERENCES "naturezas"("id_natureza") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgrupos" ADD CONSTRAINT "subgrupos_id_grupo_fk_fkey" FOREIGN KEY ("id_grupo_fk") REFERENCES "grupos"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizacoes_ocorrencias" ADD CONSTRAINT "localizacoes_ocorrencias_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitimas" ADD CONSTRAINT "vitimas_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "midias" ADD CONSTRAINT "midias_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "midias" ADD CONSTRAINT "midias_id_usuario_upload_fk_fkey" FOREIGN KEY ("id_usuario_upload_fk") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("id_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("id_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_matricula_usuario_fk_fkey" FOREIGN KEY ("matricula_usuario_fk") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
