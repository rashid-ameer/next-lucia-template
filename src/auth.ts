import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "@/lib/prisma";
import { Lucia } from "lucia";
import { cache } from "react";
import { GitHub, Google } from "arctic";
import { cookies } from "next/headers";
import { createSessionCookie, deleteSessionCookie } from "./lib/server-utils";

// creating instance of prisma adapter
const prismaAdapter = new PrismaAdapter(prisma.session, prisma.user);

// creating lucia instance
export const lucia = new Lucia(prismaAdapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      name: databaseUserAttributes.name,
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
      avatarUrl: databaseUserAttributes.avatarUrl,
      emailVerified: databaseUserAttributes.emailVerified,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string | null;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
}

// validate the session
export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      createSessionCookie(result.session.id);
    }

    if (!result.session) {
      deleteSessionCookie();
    }
  } catch {}
  return result;
});

// GITHUB instance
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

// GOOGLE instance
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);
