import { github, lucia } from "@/auth";
import { createUser, getUserByEmail, updateUser } from "@/db/user";
import { PATHS } from "@/lib/constants";
import { createSessionAndCookie } from "@/lib/server-utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await getUserByEmail(githubUser.email);

    if (!existingUser) {
      const userId = generateIdFromEntropySize(10); // 16 characters long
      await createUser({
        id: userId,
        githubId: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        emailVerified: true,
      });

      await createSessionAndCookie(userId);

      return new Response(null, {
        status: 302,
        headers: { Location: PATHS.HOME },
      });
    }

    // update the user fields
    await updateUser(existingUser.id, {
      emailVerified: existingUser.emailVerified || true,
      avatarUrl: existingUser.avatarUrl || githubUser.avatar_url,
      githubId: existingUser.githubId || githubUser.id,
    });

    await createSessionAndCookie(existingUser.id);

    return new Response(null, {
      status: 302,
      headers: { Location: PATHS.HOME },
    });
  } catch (error) {
    // the specific error message depends on the provider
    if (error instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string;
  email: string;
};
