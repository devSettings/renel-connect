-- CreateEnum
CREATE TYPE "PermissionName" AS ENUM ('CREATE_USER', 'VIEW_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_USER_PERMISSIONS', 'RESET_USER_PASSWORD', 'CREATE_PRODUCT', 'VIEW_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'MANAGE_PRODUCT_PRICING', 'MANAGE_PRODUCT_DISCOUNTS', 'VIEW_INVENTORY', 'UPDATE_INVENTORY', 'MANAGE_SUPPLIERS', 'VIEW_SUPPLY_CHAIN', 'CREATE_TRANSACTION', 'VIEW_TRANSACTION', 'UPDATE_TRANSACTION', 'DELETE_TRANSACTION', 'PROCESS_REFUND', 'APPLY_DISCOUNT', 'CREATE_CUSTOMER', 'VIEW_CUSTOMER', 'UPDATE_CUSTOMER', 'DELETE_CUSTOMER', 'VIEW_SALES_REPORTS', 'VIEW_INVENTORY_REPORTS', 'VIEW_FINANCIAL_REPORTS', 'EXPORT_REPORTS', 'MANAGE_SETTINGS', 'MANAGE_PAYMENT_METHODS', 'MANAGE_TAX_SETTINGS', 'CONFIGURE_NOTIFICATIONS', 'CONFIGURE_AUDIT_LOGS', 'VIEW_PERMISSIONS', 'ASSIGN_PERMISSIONS', 'MANAGE_ROLES', 'VIEW_AUDIT_LOGS', 'MANAGE_TWO_FACTOR_AUTH', 'VIEW_SYSTEM_LOGS', 'DEBUG_SYSTEM', 'DEPLOY_UPDATES', 'ACCESS_API', 'PERFORM_BACKUP', 'CONFIGURE_INTEGRATIONS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'CASHIER', 'MANAGER', 'SUPERVISOR', 'ADMIN', 'DEVELOPER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FRENCH', 'ENGLISH', 'SPANISH', 'CREOLE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AcceptedTypeOfID" AS ENUM ('PASSPORT', 'DRIVERS_LICENSE', 'GOVERMENT_ISSUED_ID', 'STUDENT_ID');

-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('INVENTORY', 'SERVICE', 'NON_INVENTORY', 'DIGITAL');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('WEB', 'MOBILE', 'POS');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'CHECK', 'WIRE_TRANSFER');

-- CreateEnum
CREATE TYPE "Collection" AS ENUM ('ROOM', 'DRINK', 'FOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "TypeOfTransaction" AS ENUM ('EXPENSE', 'INCOME', 'LOST', 'AQUISITION');

-- CreateEnum
CREATE TYPE "IncomeCategory" AS ENUM ('Sale_REVENUE', 'INVESTMENT', 'LOAN');

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "value" "PermissionName" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "fullNameSlug" VARCHAR(255) NOT NULL,
    "birth_date" DATE,
    "gender" "Gender" NOT NULL,
    "preferred_language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "last_login" TIMESTAMP(3),
    "id_provided" "AcceptedTypeOfID",
    "idNumber" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "membership" "Membership" NOT NULL DEFAULT 'BRONZE',
    "loyalty_points" BIGINT NOT NULL DEFAULT 0,
    "last_purchase_date" TEXT,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spend" BIGINT NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "selling_price" DOUBLE PRECISION NOT NULL,
    "department" "Collection" NOT NULL,
    "type" "ProductType" NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryProduct" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL DEFAULT 0,
    "averageUnitCostPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "reorder_level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_purchase_date" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "serviceLocation" TEXT NOT NULL,
    "serviceDuration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "product_supplied" TEXT,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reference" VARCHAR(12) NOT NULL,
    "category" "Collection" NOT NULL,
    "cashier_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "source" "OrderSource" NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "total_items" INTEGER NOT NULL,
    "order_date" TEXT NOT NULL,
    "amount_received" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "room_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,
    "order_date" TEXT NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type_of_transaction" "TypeOfTransaction" NOT NULL DEFAULT 'EXPENSE',
    "user_id" TEXT NOT NULL,
    "expense_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expense_category_id" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "category" "IncomeCategory" NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type_of_transaction" "TypeOfTransaction" NOT NULL DEFAULT 'INCOME',
    "income_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lost" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity_of_items" INTEGER NOT NULL,
    "type_of_transaction" "TypeOfTransaction" NOT NULL DEFAULT 'LOST',
    "unit_price" DECIMAL(10,2) NOT NULL,
    "lost_date" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_lost" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Lost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aquisition" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "type_of_transaction" "TypeOfTransaction" NOT NULL DEFAULT 'AQUISITION',
    "suplier_id" TEXT NOT NULL,
    "quantity_bought" INTEGER NOT NULL,
    "average_unit_cost_price" DECIMAL(10,2) NOT NULL,
    "aquisition_date" TEXT NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "expired_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Aquisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_label_key" ON "Permission"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_value_key" ON "Permission"("value");

-- CreateIndex
CREATE UNIQUE INDEX "User_fullNameSlug_key" ON "User"("fullNameSlug");

-- CreateIndex
CREATE INDEX "User_first_name_last_name_idx" ON "User"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_provided_idNumber_key" ON "User"("id_provided", "idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_first_name_last_name_key" ON "User"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_user_id_key" ON "Customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_number_key" ON "Customer"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryProduct_product_id_key" ON "InventoryProduct"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesProduct_productId_key" ON "ServicesProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_id_key" ON "Supplier"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_slug_key" ON "Supplier"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_phone_key" ON "Supplier"("phone");

-- CreateIndex
CREATE INDEX "Supplier_slug_idx" ON "Supplier"("slug");

-- CreateIndex
CREATE INDEX "Supplier_email_idx" ON "Supplier"("email");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_slug_key" ON "ExpenseCategory"("slug");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryProduct" ADD CONSTRAINT "InventoryProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesProduct" ADD CONSTRAINT "ServicesProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lost" ADD CONSTRAINT "Lost_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lost" ADD CONSTRAINT "Lost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisition" ADD CONSTRAINT "Aquisition_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisition" ADD CONSTRAINT "Aquisition_suplier_id_fkey" FOREIGN KEY ("suplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisition" ADD CONSTRAINT "Aquisition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
