"use client";
import {
  Anchor,
  AppShell,
  Avatar,
  Group,
  Menu,
  Text,
  Title,
} from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { authClient } from "../lib/auth-client";
import { ThemeToggle } from "./ThemeToggle";
import { Bitcount_Single } from "next/font/google";

export const logoutFn = async () => {
  await authClient.signOut();
  secureLocalStorage.removeItem("privateKey");
  secureLocalStorage.removeItem("publicKey");
  window.location.reload();
};

const bitcount = Bitcount_Single({
  variable: "--font-bitcount",
  subsets: ["latin"],
  fallback: ["lato", "roboto"],
});

export default function Navbar({ children }: { children: React.ReactNode }) {
  const {
    data: session,
    // isPending, //loading state
    // error, //error object
    // refetch, //refetch the session
  } = authClient.useSession();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Anchor component={Link} href="/" underline="never">
              <Title fw={700} size={"1.6rem"} className={bitcount.className}>
                Notemy
              </Title>
            </Anchor>
          </Group>
          <Group gap="sm">
            <ThemeToggle />

            {session?.user ? (
              <Menu position="bottom-end" shadow="md" width={180}>
                <Menu.Target>
                  <Avatar
                    src={session?.user?.image}
                    radius="xl"
                    size={36}
                    alt={session?.user?.name || "User avatar"}
                    style={{ cursor: "pointer" }}
                  >
                    {session?.user.name?.[0]?.toUpperCase() || ""}
                  </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="sm" fw={500} truncate="end">
                      {session.user.name || "User"}
                    </Text>

                    <Text size="xs" c="dimmed" truncate="end">
                      {session.user.email}
                    </Text>
                  </Menu.Label>

                  <Menu.Item leftSection={<IconUser size={16} />}>
                    Profile
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={16} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={logoutFn}
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : null}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
