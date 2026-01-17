"use client";
import { AppShell, Avatar, Group, Menu, Text } from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { authClient } from "../lib/auth-client";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const {
    data: session,
    // isPending, //loading state
    // error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const logoutFn = async () => {
    await authClient.signOut(); // invalidate session server-side
    secureLocalStorage.removeItem("privateKey");

    await refetch();
    window.location.reload();
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Link href="/" className="link-reset">
              <Text fw={700} size="lg">
                Notemy
              </Text>
            </Link>
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
                    className="cursor-pointer"
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
