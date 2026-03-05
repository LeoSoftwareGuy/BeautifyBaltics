import type { MasterServicesFormValues } from './types';

export const isFormValid = (values: MasterServicesFormValues): boolean => !!values.jobId && !!values.title.trim() && values.price !== '' && values.duration !== '';
