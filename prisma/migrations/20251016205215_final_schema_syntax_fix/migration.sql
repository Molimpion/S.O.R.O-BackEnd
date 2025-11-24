/*
  Warnings:

  - The values [ESPINHEIRO] on the enum `BairrosRecife` will be removed. If these variants are still used in the database, this will fail.
  - The values [PIROTECNICO,FISCALIZACAO,VISTORIA_DE_RISCO,OUTROS] on the enum `TipoNatureza` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BairrosRecife_new" AS ENUM ('AFOGADOS', 'AGUA_FRIA', 'ALTO_DO_MANDU', 'ALTO_JOSE_BONIFACIO', 'ALTO_JOSE_DO_PINHO', 'APIPUCOS', 'AREIAS', 'ARRUDA', 'BARRO', 'BEBERIBE', 'BOA_VIAGEM', 'BOA_VISTA', 'BOMBA_DO_HEMETERIO', 'BONGI', 'BRASILIA_TEIMOSA', 'BREJO_DA_GUABIRABA', 'BREJO_DE_BEBERIBE', 'CABANGA', 'CACOTE', 'CAJUEIRO', 'CAMPINA_DO_BARRETO', 'CAMPO_GRANDE', 'CASA_AMARELA', 'CASA_FORTE', 'CIDADE_UNIVERSITARIA', 'COELHOS', 'COHAB', 'CORDEIRO', 'CORREGO_DO_JENIPAPO', 'CURADO', 'DERBY', 'DOIS_IRMAOS', 'DOIS_UNIDOS', 'ENCRUZILHADA', 'ENGENHO_DO_MEIO', 'ESPINHEiro', 'ESTANCIA', 'FUNDAO', 'GRACAS', 'GUABIRABA', 'HIPODROMO', 'IBURA', 'ILHA_DO_LEITE', 'ILHA_DO_RETIRO', 'ILHA_JOANA_BEZERRA', 'IMBIRIBEIRA', 'IPSEP', 'IRAJA', 'JAQUEIRA', 'JARDIM_SAO_PAULO', 'JIQUIA', 'LINHA_DO_TIRO', 'MACAXEIRA', 'MADALENA', 'MANGABEIRA', 'MANGUEIRA', 'MONTEIRO', 'MORRO_DA_CONCEICAO', 'MUSTARDINHA', 'NOVA_DESCOBERTA', 'PAISSANDU', 'PARNAMIRIM', 'PASSARINHO', 'PAU_FERRO', 'PEIXINHOS', 'PINA', 'POCO_DA_PANELA', 'PONTO_DE_PARADA', 'PORTO_DA_MADEIRA', 'PRADO', 'RECIFE_ANTIGO', 'ROSARINHO', 'SANCHO', 'SANTANA', 'SANTO_AMARO', 'SANTO_ANTONIO', 'SAO_JOSE', 'SITIO_DOS_PINTOS', 'SOLEDADE', 'TAMARINEIRA', 'TEJIPIO', 'TORRE', 'TORREAO', 'TORROES', 'TOTO', 'TRES_PONTES', 'VARZEA', 'VASCO_DA_GAMA', 'ZUMBI', 'OUTROS');
ALTER TABLE "bairros" ALTER COLUMN "nome_bairro" TYPE "BairrosRecife_new" USING ("nome_bairro"::text::"BairrosRecife_new");
ALTER TYPE "BairrosRecife" RENAME TO "BairrosRecife_old";
ALTER TYPE "BairrosRecife_new" RENAME TO "BairrosRecife";
DROP TYPE "BairrosRecife_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TipoNatureza_new" AS ENUM ('INCENDIO', 'ANIMAL', 'ARVORE', 'QUEIMADA', 'TRANSITO', 'RESGATE');
ALTER TABLE "naturezas" ALTER COLUMN "descricao" TYPE "TipoNatureza_new" USING ("descricao"::text::"TipoNatureza_new");
ALTER TYPE "TipoNatureza" RENAME TO "TipoNatureza_old";
ALTER TYPE "TipoNatureza_new" RENAME TO "TipoNatureza";
DROP TYPE "TipoNatureza_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "localizacoes_ocorrencias" DROP CONSTRAINT "localizacoes_ocorrencias_id_ocorrencia_fk_fkey";

-- DropForeignKey
ALTER TABLE "midias" DROP CONSTRAINT "midias_id_ocorrencia_fk_fkey";

-- DropForeignKey
ALTER TABLE "ocorrencias_equipes" DROP CONSTRAINT "ocorrencias_equipes_id_ocorrencia_fk_fkey";

-- DropForeignKey
ALTER TABLE "ocorrencias_viaturas" DROP CONSTRAINT "ocorrencias_viaturas_id_ocorrencia_fk_fkey";

-- DropForeignKey
ALTER TABLE "vitimas" DROP CONSTRAINT "vitimas_id_ocorrencia_fk_fkey";

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "grupos_id_natureza_fk_idx" ON "grupos"("id_natureza_fk");

-- CreateIndex
CREATE INDEX "midias_id_ocorrencia_fk_idx" ON "midias"("id_ocorrencia_fk");

-- CreateIndex
CREATE INDEX "midias_id_usuario_upload_fk_idx" ON "midias"("id_usuario_upload_fk");

-- CreateIndex
CREATE INDEX "ocorrencias_id_subgrupo_fk_idx" ON "ocorrencias"("id_subgrupo_fk");

-- CreateIndex
CREATE INDEX "ocorrencias_id_bairro_fk_idx" ON "ocorrencias"("id_bairro_fk");

-- CreateIndex
CREATE INDEX "ocorrencias_id_forma_acervo_fk_idx" ON "ocorrencias"("id_forma_acervo_fk");

-- CreateIndex
CREATE INDEX "ocorrencias_id_usuario_abertura_fk_idx" ON "ocorrencias"("id_usuario_abertura_fk");

-- CreateIndex
CREATE INDEX "ocorrencias_status_situacao_idx" ON "ocorrencias"("status_situacao");

-- CreateIndex
CREATE INDEX "subgrupos_id_grupo_fk_idx" ON "subgrupos"("id_grupo_fk");

-- CreateIndex
CREATE INDEX "unidades_operacionais_id_grupamento_fk_idx" ON "unidades_operacionais"("id_grupamento_fk");

-- CreateIndex
CREATE INDEX "usuarios_id_unidade_operacional_fk_idx" ON "usuarios"("id_unidade_operacional_fk");

-- CreateIndex
CREATE INDEX "viaturas_id_unidade_operacional_fk_idx" ON "viaturas"("id_unidade_operacional_fk");

-- CreateIndex
CREATE INDEX "vitimas_id_ocorrencia_fk_idx" ON "vitimas"("id_ocorrencia_fk");

-- AddForeignKey
ALTER TABLE "localizacoes_ocorrencias" ADD CONSTRAINT "localizacoes_ocorrencias_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitimas" ADD CONSTRAINT "vitimas_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "midias" ADD CONSTRAINT "midias_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_id_ocorrencia_fk_fkey" FOREIGN KEY ("id_ocorrencia_fk") REFERENCES "ocorrencias"("id_ocorrencia") ON DELETE CASCADE ON UPDATE CASCADE;
