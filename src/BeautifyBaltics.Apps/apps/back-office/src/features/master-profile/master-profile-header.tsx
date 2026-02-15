import { useTranslation } from 'react-i18next';
import { Box, Button, Container } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

type ProfileHeaderProps = {
  backTo: '/explore';
};

function ProfileHeader({ backTo }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      pos="sticky"
      top={0}
      bg="var(--mantine-color-body)"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <Container size="lg" py="md">
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate({ to: backTo })}
        >
          {t('masterProfile.backToExplore')}
        </Button>
      </Container>
    </Box>
  );
}

export default ProfileHeader;
