import prisma from "@/lib/prisma";

export async function deleteAllUserEmailVerificationCodes(userId: string) {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
}

export async function createUserEmailVerificationCode(data: {
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
}) {
  await prisma.emailVerificationCode.create({
    data: data,
  });
}
