/*
  Warnings:

  - You are about to drop the column `id_municipio_fk` on the `ocorrencias` table. All the data in the column will be lost.
  - The primary key for the `ocorrencias_equipes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ocorrencias_viaturas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `viaturas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_viatura` on the `viaturas` table. All the data in the column will be lost.
  - You are about to drop the `municipios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_bairro_fk` to the `ocorrencias` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id_viatura_fk` on the `ocorrencias_equipes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_viatura_fk` on the `ocorrencias_viaturas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `numero_viatura` on the `viaturas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NumeroViatura" AS ENUM ('CAT_01', 'CAT_02', 'CAT_03', 'CAT_04', 'ABT_01', 'ABT_02', 'ABT_03', 'ABT_04', 'AR_01', 'AR_02', 'AR_03', 'AR_04');

-- CreateEnum
CREATE TYPE "BairrosRecife" AS ENUM ('AFOGADOS', 'AGUA_FRIA', 'ALTO_DO_MANDU', 'ALTO_JOSE_BONIFACIO', 'ALTO_JOSE_DO_PINHO', 'APIPUCOS', 'AREIAS', 'ARRUDA', 'BARRO', 'BEBERIBE', 'BOA_VIAGEM', 'BOA_VISTA', 'BOMBA_DO_HEMETERIO', 'BONGI', 'BRASILIA_TEIMOSA', 'BREJO_DA_GUABIRABA', 'BREJO_DE_BEBERIBE', 'CABANGA', 'CACOTE', 'CAJUEIRO', 'CAMPINA_DO_BARRETO', 'CAMPO_GRANDE', 'CASA_AMARELA', 'CASA_FORTE', 'CIDADE_UNIVERSITARIA', 'COELHOS', 'COHAB', 'CORDEIRO', 'CORREGO_DO_JENIPAPO', 'CURADO', 'DERBY', 'DOIS_IRMAOS', 'DOIS_UNIDOS', 'ENCRUZILHADA', 'ENGENHO_DO_MEIO', 'ESPINHEIRO', 'ESTANCIA', 'FUNDAO', 'GRACAS', 'GUABIRABA', 'HIPODROMO', 'IBURA', 'ILHA_DO_LEITE', 'ILHA_DO_RETIRO', 'ILHA_JOANA_BEZERRA', 'IMBIRIBEIRA', 'IPSEP', 'IRAJA', 'JAQUEIRA', 'JARDIM_SAO_PAULO', 'JIQUIA', 'LINHA_DO_TIRO', 'MACAXEIRA', 'MADALENA', 'MANGABEIRA', 'MANGUEIRA', 'MONTEIRO', 'MORRO_DA_CONCEICAO', 'MUSTARDINHA', 'NOVA_DESCOBERTA', 'PAISSANDU', 'PARNAMIRIM', 'PASSARINHO', 'PAU_FERRO', 'PEIXINHOS', 'PINA', 'POCO_DA_PANELA', 'PONTO_DE_PARADA', 'PORTO_DA_MADEIRA', 'PRADO', 'RECIFE_ANTIGO', 'ROSARINHO', 'SANCHO', 'SANTANA', 'SANTO_AMARO', 'SANTO_ANTONIO', 'SAO_JOSE', 'SITIO_DOS_PINTOS', 'SOLEDADE', 'TAMARINEIRA', 'TEJIPIO', 'TORRE', 'TORREAO', 'TORROES', 'TOTO', 'TRES_PONTES', 'VARZEA', 'VASCO_DA_GAMA', 'ZUMBI', 'OUTROS');

-- DropForeignKey
ALTER TABLE "ocorrencias" DROP CONSTRAINT "ocorrencias_id_municipio_fk_fkey";

-- DropForeignKey
ALTER TABLE "ocorrencias_equipes" DROP CONSTRAINT "ocorrencias_equipes_id_viatura_fk_fkey";

-- DropForeignKey
ALTER TABLE "ocorrencias_viaturas" DROP CONSTRAINT "ocorrencias_viaturas_id_viatura_fk_fkey";

-- DropIndex
DROP INDEX "viaturas_numero_viatura_key";

-- AlterTable
ALTER TABLE "ocorrencias" DROP COLUMN "id_municipio_fk",
ADD COLUMN     "id_bairro_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ocorrencias_equipes" DROP CONSTRAINT "ocorrencias_equipes_pkey",
DROP COLUMN "id_viatura_fk",
ADD COLUMN     "id_viatura_fk" "NumeroViatura" NOT NULL,
ADD CONSTRAINT "ocorrencias_equipes_pkey" PRIMARY KEY ("id_ocorrencia_fk", "id_viatura_fk", "matricula_usuario_fk");

-- AlterTable
ALTER TABLE "ocorrencias_viaturas" DROP CONSTRAINT "ocorrencias_viaturas_pkey",
DROP COLUMN "id_viatura_fk",
ADD COLUMN     "id_viatura_fk" "NumeroViatura" NOT NULL,
ADD CONSTRAINT "ocorrencias_viaturas_pkey" PRIMARY KEY ("id_ocorrencia_fk", "id_viatura_fk");

-- AlterTable
ALTER TABLE "viaturas" DROP CONSTRAINT "viaturas_pkey",
DROP COLUMN "id_viatura",
DROP COLUMN "numero_viatura",
ADD COLUMN     "numero_viatura" "NumeroViatura" NOT NULL,
ADD CONSTRAINT "viaturas_pkey" PRIMARY KEY ("numero_viatura");

-- DropTable
DROP TABLE "municipios";

-- DropEnum
DROP TYPE "NomesMunicipios";

-- CreateTable
CREATE TABLE "bairros" (
    "id_bairro" TEXT NOT NULL,
    "nome_bairro" "BairrosRecife" NOT NULL,
    "regiao" TEXT,
    "ais" TEXT,

    CONSTRAINT "bairros_pkey" PRIMARY KEY ("id_bairro")
);

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_id_bairro_fk_fkey" FOREIGN KEY ("id_bairro_fk") REFERENCES "bairros"("id_bairro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_viaturas" ADD CONSTRAINT "ocorrencias_viaturas_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("numero_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_equipes" ADD CONSTRAINT "ocorrencias_equipes_id_viatura_fk_fkey" FOREIGN KEY ("id_viatura_fk") REFERENCES "viaturas"("numero_viatura") ON DELETE RESTRICT ON UPDATE CASCADE;
