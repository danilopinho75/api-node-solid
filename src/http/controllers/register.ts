import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { FastifyRequest, FastifyReply } from 'fastify';
import type fastify from "fastify";
import { hash } from "bcryptjs";

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body);

  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail) {
    return reply.status(409).send("Já existe um usuário com este email!");
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash
    }
  })

  return reply.status(201).send("Usuário criado com sucesso!");
}