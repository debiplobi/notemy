"use client";

import { Container, Center, Title, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignIn from "@/components/sign-in";
import { authClient } from "@/lib/auth-client";
import { IconBolt } from "@tabler/icons-react";

export default function SignInPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <IconBolt size="2rem" className="animate-spin" />
      </div>
    );
  }

  return (
    <Container size="xs" h="100vh">
      <Center h="100%">
        <Stack gap="xl" w="100%">
          <Stack gap="xs" align="center">
            <Title order={2}>Welcome back</Title>
            <Text c="dimmed" size="sm">
              Sign in to access your secure notes
            </Text>
          </Stack>

          <SignIn />
        </Stack>
      </Center>
    </Container>
  );
}
