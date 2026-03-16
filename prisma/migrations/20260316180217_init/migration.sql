-- CreateTable
CREATE TABLE "BasketType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "minProducts" INTEGER NOT NULL,
    "maxProducts" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "store" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
