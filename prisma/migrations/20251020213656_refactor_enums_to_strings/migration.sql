/*
  ATENÇÃO: Este código foi modificado manualmente para preservar dados nas tabelas:
  bairros, naturezas, viaturas, ocorrencias_viaturas e ocorrencias_equipes,
  durante a transição de ENUM para STRING/UUID.
*/

-- Excluir as chaves estrangeiras (FKs) antes de alterar as colunas
ALTER TABLE "ocorrencias_equipes" DROP CONSTRAINT "ocorrencias_equipes_id_viatura_fk_fkey";
ALTER TABLE "ocorrencias_viaturas" DROP CONSTRAINT "ocorrencias_viaturas_id_viatura_fk_fkey";

-- =========================================================================================
-- 1. ALTERAÇÃO SEGURA: BAIRROS (Enum -> String)
-- =========================================================================================
ALTER TABLE "bairros" RENAME COLUMN "nome_bairro" TO "nome_bairro_old";
ALTER TABLE "bairros" ADD COLUMN "nome_bairro" TEXT;
-- Copia os dados
UPDATE "bairros" SET "nome_bairro" = "nome_bairro_old"::text;
-- Remove a coluna antiga e define NOT NULL para o novo campo
ALTER TABLE "bairros" DROP COLUMN "nome_bairro_old";
ALTER TABLE "bairros" ALTER COLUMN "nome_bairro" SET NOT NULL;
-- Adiciona a restrição UNIQUE
CREATE UNIQUE INDEX "bairros_nome_bairro_key" ON "bairros"("nome_bairro");


-- =========================================================================================
-- 2. ALTERAÇÃO SEGURA: NATUREZAS (Enum -> String)
-- =========================================================================================
ALTER TABLE "naturezas" RENAME COLUMN "descricao" TO "descricao_old";
ALTER TABLE "naturezas" ADD COLUMN "descricao" TEXT;
-- Copia os dados
UPDATE "naturezas" SET "descricao" = "descricao_old"::text;
-- Remove a coluna antiga e define NOT NULL para o novo campo
ALTER TABLE "naturezas" DROP COLUMN "descricao_old";
ALTER TABLE "naturezas" ALTER COLUMN "descricao" SET NOT NULL;
-- Adiciona a restrição UNIQUE
CREATE UNIQUE INDEX "naturezas_descricao_key" ON "naturezas"("descricao");


-- =========================================================================================
-- 3. ALTERAÇÃO SEGURA: VIATURAS (PK Enum -> PK UUID e String)
-- =========================================================================================
-- 3.1 Adiciona o novo PK (id_viatura) como opcional e popula
ALTER TABLE "viaturas" ADD COLUMN "id_viatura" TEXT;
-- Popula as linhas existentes com um UUID (necessita da extensão pgcrypto)
UPDATE "viaturas" SET "id_viatura" = gen_random_uuid() WHERE "id_viatura" IS NULL;

-- 3.2 Altera a coluna numero_viatura (Enum -> String)
ALTER TABLE "viaturas" RENAME COLUMN "numero_viatura" TO "numero_viatura_old";
ALTER TABLE "viaturas" ADD COLUMN "numero_viatura" TEXT;
UPDATE "viaturas" SET "numero_viatura" = "numero_viatura_old"::text;
ALTER TABLE "viaturas" DROP COLUMN "numero_viatura_old";
ALTER TABLE "viaturas" ALTER COLUMN "numero_viatura" SET NOT NULL;
ALTER TABLE "viaturas" ADD CONSTRAINT "viaturas_numero_viatura_key" UNIQUE ("numero_viatura");

-- 3.3 Define o novo PK e remove o PK antigo
ALTER TABLE "viaturas" DROP CONSTRAINT IF EXISTS "viaturas_pkey";
ALTER TABLE "viaturas" ADD CONSTRAINT "viaturas_pkey" PRIMARY KEY ("id_viatura");
ALTER TABLE "viaturas" ALTER COLUMN "id_viatura" SET NOT NULL;


-- =========================================================================================
-- 4. ATUALIZAÇÃO SEGURA: RELACIONAMENTOS N:M (ocorrencias_viaturas)
-- =========================================================================================
-- 4.1 Renomeia a FK antiga (que era o Enum) e adiciona a nova FK (que é o novo UUID da Viatura)
ALTER TABLE "ocorrencias_viaturas" RENAME COLUMN "id_viatura_fk" TO "id_viatura_fk_old";
ALTER TABLE "ocorrencias_viaturas" ADD COLUMN "id_viatura_fk" TEXT;

-- 4.2 Popula a nova FK com o UUID, mapeando o valor do Enum antigo
UPDATE "ocorrencias_viaturas"
SET "id_viatura_fk" = v."id_viatura"
FROM "viaturas" v
WHERE v."numero_viatura"::text = "ocorrencias_viaturas"."id_viatura_fk_old"::text;

-- 4.3 Finaliza a transição
ALTER TABLE "ocorrencias_viaturas" DROP COLUMN "id_viatura_fk_old";
ALTER TABLE "ocorrencias_viaturas" ALTER COLUMN "id_viatura_fk" SET NOT NULL;
ALTER TABLE "ocorrencias_viaturas" DROP CONSTRAINT IF EXISTS "ocorrencias_viaturas_pkey";
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_pkey" PRIMARY KEY ("id_ocorrencia_fk", "id_viatura_fk");


-- =========================================================================================
-- 5. ATUALIZAÇÃO SEGURA: RELACIONAMENTOS N:M (ocorrencias_equipes)
-- =========================================================================================
-- 5.1 Renomeia a FK antiga (que era o Enum) e adiciona a nova FK (que é o novo UUID da Viatura)
ALTER TABLE "ocorrencias_equipes" RENAME COLUMN "id_viatura_fk" TO "id_viatura_fk_old";
ALTER TABLE "ocorrencias_equipes" ADD COLUMN "id_viatura_fk" TEXT;

-- 5.2 Popula a nova FK com o UUID, mapeando o valor do Enum antigo
UPDATE "ocorrencias_equipes"
SET "id_viatura_fk" = v."id_viatura"
FROM "viaturas" v
WHERE v."numero_viatura"::text = "ocorrencias_equipes"."id_viatura_fk_old"::text;

-- 5.3 Finaliza a transição
ALTER TABLE "ocorrencias_equipes" DROP COLUMN "id_viatura_fk_old";
ALTER TABLE "ocorrencias_equipes" ALTER COLUMN "id_viatura_fk" SET NOT NULL;
ALTER TABLE "ocorrencias_equipes" DROP CONSTRAINT IF EXISTS "ocorrencias_equipes_pkey";
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_pkey" PRIMARY KEY ("id_ocorrencia_fk", "id_viatura_fk", "matricula_usuario_fk");


-- =========================================================================================
-- 6. LIMPEZA FINAL (Drop Enums e Adiciona Novas FKs)
-- =========================================================================================
-- Drop Enums antigos (assumindo que o Prisma não o fez automaticamente no seu arquivo)
-- Note: Se esses comandos já existirem, apenas mantenha-os.
DROP TYPE "BairrosRecife";
DROP TYPE "NumeroViatura";
DROP TYPE "TipoNatureza";

-- Adiciona as novas Foreign Keys (FKs)
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("id_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("id_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;