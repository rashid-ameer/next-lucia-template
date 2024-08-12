import { google, lucia } from "@/auth";
import { createUser, getUserByEmail, updateUser } from "@/db/user";
import { PATHS } from "@/lib/constants";
import { createSessionAndCookie } from "@/lib/server-utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");

  // get the stored state and code verifier
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_oauth_code_verifier")?.value ?? null;

  // check if the state and code verifier are valid
  if (
    !state ||
    !code ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  // exchange the code for tokens
  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const googleUser: GoogleUser = await googleUserResponse.json();

    // find existing user first
    const existingUser = await getUserByEmail(googleUser.email);

    if (!existingUser) {
      const userId = generateIdFromEntropySize(10); // 16 characters long
      await createUser({
        id: userId,
        googleId: googleUser.id,
        username: googleUser.email,
        email: googleUser.email,
        avatarUrl: googleUser.picture,
        emailVerified: googleUser.verified_email,
      });

      await createSessionAndCookie(userId);

      return new Response(null, {
        status: 302,
        headers: { Location: PATHS.HOME },
      });
    }

    // update the user fields
    await updateUser(existingUser.id, {
      googleId: existingUser.googleId || googleUser.id,
      avatarUrl: existingUser.avatarUrl || googleUser.picture,
      emailVerified: existingUser.emailVerified || googleUser.verified_email,
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

type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  picture: string;
};
