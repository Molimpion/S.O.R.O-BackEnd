/*
  Warnings:

  - Added the required column `id_municipio_fk` to the `bairros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bairros" ADD COLUMN     "id_municipio_fk" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "municipios" (
    "id_municipio" TEXT NOT NULL,
    "nome_municipio" TEXT NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateIndex
CREATE UNIQUE INDEX "municipios_nome_municipio_key" ON "municipios"("nome_municipio");

-- CreateIndex
CREATE INDEX "bairros_id_municipio_fk_idx" ON "bairros"("id_municipio_fk");

-- AddForeignKey
ALTER TABLE "bairros" ADD CONSTRAINT "bairros_id_municipio_fk_fkey" FOREIGN KEY ("id_municipio_fk") REFERENCES "municipios"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;
