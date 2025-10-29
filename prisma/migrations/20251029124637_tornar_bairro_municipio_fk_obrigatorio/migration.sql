-- DropForeignKey
ALTER TABLE "bairros" DROP CONSTRAINT "bairros_id_municipio_fk_fkey";

-- AlterTable
ALTER TABLE "bairros" ALTER COLUMN "id_municipio_fk" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bairros" ADD CONSTRAINT "bairros_id_municipio_fk_fkey" FOREIGN KEY ("id_municipio_fk") REFERENCES "municipios"("id_municipio") ON DELETE SET NULL ON UPDATE CASCADE;
