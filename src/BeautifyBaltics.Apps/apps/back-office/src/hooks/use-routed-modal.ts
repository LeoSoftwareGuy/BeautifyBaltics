import { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { NavigateOptions, useLocation, useNavigate } from '@tanstack/react-router';

export default function useRoutedModal(name: string) {
  const navigate = useNavigate();
  const location = useLocation();

  const [opened, { open, close }] = useDisclosure(location.hash === name);

  useEffect(() => {
    if (opened) return;
    if (location.hash === name) open();
  }, [location, opened, open, name]);

  const onOpen = async () => {
    const props: NavigateOptions = { search: location.search as never, hash: name, replace: true };
    await navigate(props);
    open();
  };

  const onClose = async () => {
    const props: NavigateOptions = { search: location.search as never, hash: undefined, replace: true };
    await navigate(props);
    close();
  };

  return { opened, onOpen, onClose };
}
