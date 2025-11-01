-- AlterTable
ALTER TABLE "bairros" ADD COLUMN     "id_municipio_fk" TEXT;

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
ALTER TABLE "bairros" ADD CONSTRAINT "bairros_id_municipio_fk_fkey" FOREIGN KEY ("id_municipio_fk") REFERENCES "municipios"("id_municipio") ON DELETE SET NULL ON UPDATE CASCADE;
