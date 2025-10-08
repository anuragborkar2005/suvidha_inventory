-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_product_id_fkey`;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
