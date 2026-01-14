import { Button, Paper, Stack } from "@mantine/core";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { githubOAuthSignIn, googleOAuthSignIn } from "../lib/auth-client";

export default function SignIn() {
  return (
    <Paper withBorder shadow="md" radius="md" p={20}>
      <Stack gap="xs">
        <form action={githubOAuthSignIn}>
          <Button
            type="submit"
            leftSection={<IconBrandGithub size={18} />}
            variant="default"
            fullWidth
            size="md"
          >
            Continue with GitHub
          </Button>
        </form>

        <form action={googleOAuthSignIn}>
          <Button
            type="submit"
            leftSection={<IconBrandGoogle size={18} />}
            variant="default"
            fullWidth
            size="md"
          >
            Continue with Google
          </Button>
        </form>
      </Stack>
    </Paper>
  );
}
