-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "student" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);
