/*
  Warnings:

  - The values [ABERTA,CONCLUIDA] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');
ALTER TABLE "ocorrencias" ALTER COLUMN "status_situacao" DROP DEFAULT;
ALTER TABLE "ocorrencias" ALTER COLUMN "status_situacao" TYPE "Status_new" USING ("status_situacao"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "ocorrencias" ALTER COLUMN "status_situacao" SET DEFAULT 'PENDENTE';
COMMIT;

-- AlterTable
ALTER TABLE "ocorrencias" ALTER COLUMN "status_situacao" SET DEFAULT 'PENDENTE';
