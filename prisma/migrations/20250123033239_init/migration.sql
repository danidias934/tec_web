-- CreateTable
CREATE TABLE `country` (
    `alpha2_code` VARCHAR(2) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `alpha3_code` VARCHAR(3) NOT NULL,
    `moeda` VARCHAR(255) NOT NULL,
    `linguas` VARCHAR(255) NOT NULL,
    `capital` VARCHAR(255) NOT NULL,
    `populacao` BIGINT NOT NULL,
    `continente` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `country_alpha2_code_key`(`alpha2_code`),
    PRIMARY KEY (`alpha2_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
