-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_id_unidade_operacional_fk_fkey";

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "id_unidade_operacional_fk" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_unidade_operacional_fk_fkey" FOREIGN KEY ("id_unidade_operacional_fk") REFERENCES "unidades_operacionais"("id_unidade") ON DELETE SET NULL ON UPDATE CASCADE;
