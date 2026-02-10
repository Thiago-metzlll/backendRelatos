-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_de_relatos" (
    "id_relato" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "tipos_de_relatos_pkey" PRIMARY KEY ("id_relato")
);

-- CreateTable
CREATE TABLE "posts" (
    "id_post" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_relato" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "quantidade_vts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id_post")
);

-- CreateTable
CREATE TABLE "votos" (
    "id_voto" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,

    CONSTRAINT "votos_pkey" PRIMARY KEY ("id_voto")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "votos_id_user_id_post_key" ON "votos"("id_user", "id_post");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_relato_fkey" FOREIGN KEY ("id_relato") REFERENCES "tipos_de_relatos"("id_relato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos" ADD CONSTRAINT "votos_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos" ADD CONSTRAINT "votos_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;
