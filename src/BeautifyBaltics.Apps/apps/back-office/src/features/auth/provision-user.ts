import { createClient } from '@/state/endpoints/clients';
import { createMaster } from '@/state/endpoints/masters';

export type UserProvisionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'client' | 'master';
};

export async function provisionUserProfile(payload: UserProvisionPayload) {
  const trimmed = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    phoneNumber: payload.phoneNumber.trim(),
    role: payload.role,
  };

  if (trimmed.role === 'master') {
    await createMaster({
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      email: trimmed.email,
      phoneNumber: trimmed.phoneNumber,
    });
    return;
  }

  await createClient({
    firstName: trimmed.firstName,
    lastName: trimmed.lastName,
    email: trimmed.email,
    phoneNumber: trimmed.phoneNumber,
  });
}
