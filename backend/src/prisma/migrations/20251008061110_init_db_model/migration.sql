-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    `refreshToken` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'general',
    `stock_quantity` INTEGER NOT NULL,
    `cost_price` DOUBLE NOT NULL,
    `selling_price` DOUBLE NOT NULL,
    `profit` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `total_cost` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Sale_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
