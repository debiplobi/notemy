import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export const githubOAuthSignIn = async () => {
  await authClient.signIn.social({
    provider: "github",
  });
};

export const googleOAuthSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
  });
};
