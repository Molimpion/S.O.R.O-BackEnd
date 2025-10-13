-- CreateEnum
CREATE TYPE "Profile" AS ENUM ('ADMIN', 'ANALISTA', 'CHEFE');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('USER_LOGIN_SUCCESS', 'USER_LOGIN_FAILURE', 'USER_REGISTERED', 'ADMIN_VIEWED_USERS', 'ADMIN_VIEWED_USER_DETAILS', 'ADMIN_UPDATED_USER', 'ADMIN_DELETED_USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile" "Profile" NOT NULL DEFAULT 'ANALISTA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
