/*
  Warnings:

  - Changed the type of `descricao` on the `naturezas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoNatureza" AS ENUM ('PIROTECNICO', 'FISCALIZACAO', 'VISTORIA_DE_RISCO', 'OUTROS');

-- AlterTable
ALTER TABLE "naturezas" DROP COLUMN "descricao",
ADD COLUMN     "descricao" "TipoNatureza" NOT NULL;
