"use client";
import { AppShell, Group, Text, Menu, Avatar } from "@mantine/core";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { authClient } from "../lib/auth-client";
import { IconLogout, IconUser, IconSettings } from "@tabler/icons-react";
import secureLocalStorage from "react-secure-storage";

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
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
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
            ) : (
              <></>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
