import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function insertUser(data: {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export async function updateUserEmailStatus(id: string) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      emailVerified: true,
    },
  });
  return user;
}

export async function createUser(data: {
  id: string;
  githubId?: number;
  username: string;
  email: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  googleId?: string;
  passwordHash?: string;
}): Promise<User> {
  const user = await prisma.user.create({
    data,
  });
  return user;
}

export async function updateUser(id: string, data: Partial<User>) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return user;
}
