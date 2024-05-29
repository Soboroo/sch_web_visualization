-- CreateTable
CREATE TABLE `environment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` INTEGER NOT NULL,
    `humidity` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
