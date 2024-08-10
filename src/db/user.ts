import prisma from "@/lib/prisma";

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
