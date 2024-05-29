/*
  Warnings:

  - You are about to drop the column `humidity` on the `environment` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `environment` table. All the data in the column will be lost.
  - Added the required column `indoor_humidity` to the `environment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indoor_temperature` to the `environment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outdoor_humidity` to the `environment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outdoor_temperature` to the `environment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `environment` DROP COLUMN `humidity`,
    DROP COLUMN `temperature`,
    ADD COLUMN `indoor_humidity` INTEGER NOT NULL,
    ADD COLUMN `indoor_temperature` INTEGER NOT NULL,
    ADD COLUMN `outdoor_humidity` INTEGER NOT NULL,
    ADD COLUMN `outdoor_temperature` INTEGER NOT NULL;
