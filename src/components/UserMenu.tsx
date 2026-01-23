"use client";
import { Avatar, Menu, Text } from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <Menu position="bottom-end" shadow="md" width={180}>
      <Menu.Target>
        <Avatar
          src={user.image || null}
          radius="xl"
          size={36}
          alt={user.name || "User"}
          style={{ cursor: "pointer" }}
        >
          {user.name?.[0]?.toUpperCase() || "U"}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Text size="sm" fw={500} truncate="end">
            {user.name || "User"}
          </Text>
          <Text size="xs" c="dimmed" truncate="end">
            {user.email}
          </Text>
        </Menu.Label>
        <Menu.Item leftSection={<IconUser size={16} />}>Profile</Menu.Item>
        <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={16} />}>
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
