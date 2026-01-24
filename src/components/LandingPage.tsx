import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
  SimpleGrid,
  rem,
  Box,
} from "@mantine/core";
import {
  IconLock,
  IconShieldCheck,
  IconEye,
  IconBrandGithub,
  Icon,
} from "@tabler/icons-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container size="md">
          <Stack gap={32} align="center">
            <Title
              order={1}
              style={{
                fontSize: rem(56),
                fontWeight: 700,
                lineHeight: 1.2,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Private notes.
              <br />
              <Text component="span" inherit c="Remoraid.7">
                End-to-end encrypted.
              </Text>
            </Title>

            <Text c="Remoraid.8" maw={480} ta="center" size="lg">
              Your notes are encrypted before they leave your device. Simple,
              secure, and private.
            </Text>

            <Group gap="md" mt="md">
              <Button
                component={Link}
                href="/auth/sign-in"
                size="lg"
                radius="md"
                color="Remoraid"
                styles={{
                  root: {
                    border: "none",
                  },
                }}
              >
                Get Started
              </Button>
              <Button
                component="a"
                href="https://github.com/debiplobi/notemy"
                target="_blank"
                size="lg"
                radius="md"
                variant="subtle"
                color="Remoraid"
                leftSection={<IconBrandGithub size={18} />}
              >
                GitHub
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box py={80}>
        <Container size="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={40}>
            <FeatureCard
              icon={IconLock}
              title="Encrypted"
              description="Zero-knowledge encryption keeps your notes private"
            />
            <FeatureCard
              icon={IconShieldCheck}
              title="Secure"
              description="Your data is protected with industry-standard encryption"
            />
            <FeatureCard
              icon={IconEye}
              title="Private"
              description="Only you can read your notes. Not even we can access them"
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: Icon;
  title: string;
  description: string;
}) {
  return (
    <Stack gap="md" align="center" ta="center">
      <ThemeIcon size={44} radius="md" variant="light" color="Remoraid">
        <Icon size={22} stroke={1.5} />
      </ThemeIcon>
      <Stack gap={8}>
        <Text size="md" fw={600}>
          {title}
        </Text>
        <Text c="Remoraid.2" size="sm" style={{ lineHeight: 1.5 }}>
          {description}
        </Text>
      </Stack>
    </Stack>
  );
}
