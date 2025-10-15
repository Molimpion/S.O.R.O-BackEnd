/*
  Warnings:

  - Changed the type of `nome_municipio` on the `municipios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NomesMunicipios" AS ENUM ('RECIFE', 'OLINDA', 'JABOATAO_DOS_GUARARAPES', 'PAULISTA', 'CAMARAGIBE', 'SAO_LOURENCO_DA_MATA', 'CABO_DE_SANTO_AGOSTINHO', 'IGARASSU', 'IPOJUCA', 'MORENO', 'ABREU_E_LIMA', 'ITAPISSUMA', 'ILHA_DE_ITAMARACA', 'ARACOIABA', 'OUTROS');

-- AlterTable
ALTER TABLE "municipios" DROP COLUMN "nome_municipio",
ADD COLUMN     "nome_municipio" "NomesMunicipios" NOT NULL;
