import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { FastifyRequest, FastifyReply } from 'fastify';
import type fastify from "fastify";
import { hash } from "bcryptjs";
import { registerUseCase } from "@/use-cases/register";

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    await registerUseCase({
      name,
      email,
      password
    })
  } catch (error) {
    return reply.status(409).send(error)
  }

  return reply.status(201).send("Usuário criado com sucesso!");
}