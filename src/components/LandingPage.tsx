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
        p={{ base: "md", sm: "lg" }}
      >
        <Container size="md">
          <Stack gap={{ base: 24, sm: 32 }} align="center">
            <Title
              order={1}
              fz={{ base: rem(32), sm: rem(40), md: rem(56) }}
              style={{
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
            <Text
              c="Remoraid.8"
              maw={480}
              ta="center"
              fz={{ base: "md", sm: "lg" }}
              px={{ base: "md", sm: 0 }}
            >
              Your notes are encrypted before they leave your device. Simple,
              secure, and private.
            </Text>
            <Group gap="md" mt={{ base: "sm", sm: "md" }} justify="center">
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
      <Box py={{ base: 40, sm: 60, md: 80 }} px={{ base: "md", sm: 0 }}>
        <Container size="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 32, sm: 40 }}>
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
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  title: string;
  description: string;
}) {
  return (
    <Stack gap="md" align="center" ta="center">
      <ThemeIcon
        size={{ base: 40, sm: 44 }}
        radius="md"
        variant="light"
        color="Remoraid"
      >
        <Icon size={22} stroke={1.5} />
      </ThemeIcon>
      <Stack gap={8}>
        <Text c="Remoraid.8" fz={{ base: "sm", sm: "md" }} fw={600}>
          {title}
        </Text>
        <Text c="Remoraid.2" size="sm" style={{ lineHeight: 1.5 }}>
          {description}
        </Text>
      </Stack>
    </Stack>
  );
}
