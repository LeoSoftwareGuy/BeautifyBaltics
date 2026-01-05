import { useMemo, useState } from 'react';
import { Stack } from '@mantine/core';

import type {
  Treatment,
  TreatmentCategory,
  TreatmentFormValues,
} from './master-treatments.types';
import { MasterTreatmentsForm } from './master-treatments-form';
import { MasterTreatmentsList } from './master-treatments-list';
import { MasterTreatmentsUploadModal } from './master-treatments-upload-modal';

const systemTreatments: readonly TreatmentCategory[] = [
  { id: 'haircut', name: 'Haircut' },
  { id: 'hair-coloring', name: 'Hair Coloring' },
  { id: 'hair-styling', name: 'Hair Styling' },
  { id: 'beard-trim', name: 'Beard Trim' },
  { id: 'manicure', name: 'Manicure' },
  { id: 'pedicure', name: 'Pedicure' },
  { id: 'facial', name: 'Facial' },
  { id: 'massage', name: 'Massage' },
  { id: 'waxing', name: 'Waxing' },
  { id: 'makeup', name: 'Makeup' },
  { id: 'eyebrow-shaping', name: 'Eyebrow Shaping' },
  { id: 'eyelash-extensions', name: 'Eyelash Extensions' },
  { id: 'nail-art', name: 'Nail Art' },
  { id: 'skin-care', name: 'Skin Care' },
  { id: 'body-treatment', name: 'Body Treatment' },
] as const;

export function MasterTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  const selectedTreatment = useMemo(
    () => treatments.find((treatment) => treatment.id === selectedTreatmentId) ?? null,
    [selectedTreatmentId, treatments],
  );

  const handleAddTreatment = ({
    categoryId,
    name,
    price,
    duration,
  }: TreatmentFormValues) => {
    const categoryInfo = systemTreatments.find(
      (treatmentCategory) => treatmentCategory.id === categoryId,
    );

    setTreatments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        category: categoryId,
        categoryName: categoryInfo?.name ?? categoryId,
        name,
        price,
        duration,
        images: [],
      },
    ]);
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments((prev) => prev.filter((treatment) => treatment.id !== id));
    if (selectedTreatmentId === id) {
      setSelectedTreatmentId(null);
      setUploadModalOpened(false);
    }
  };

  const handleOpenUploadModal = (id: string) => {
    setSelectedTreatmentId(id);
    setUploadModalOpened(true);
  };

  const handleImageUpload = (files: File[] | null) => {
    if (!selectedTreatmentId || !files || files.length === 0) {
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setTreatments((prev) => prev.map(
      (treatment) => (treatment.id === selectedTreatmentId
        ? { ...treatment, images: [...treatment.images, ...imageUrls] }
        : treatment),
    ));
  };

  const handleRemoveImage = (treatmentId: string, imageIndex: number) => {
    setTreatments((prev) => prev.map(
      (treatment) => (treatment.id === treatmentId
        ? {
          ...treatment,
          images: treatment.images.filter((_, index) => index !== imageIndex),
        }
        : treatment),
    ));
  };

  return (
    <>
      <Stack gap="lg">
        <MasterTreatmentsForm
          categories={systemTreatments}
          onAdd={handleAddTreatment}
        />

        <MasterTreatmentsList
          treatments={treatments}
          onUploadClick={handleOpenUploadModal}
          onDelete={handleDeleteTreatment}
          onRemoveImage={handleRemoveImage}
        />
      </Stack>

      <MasterTreatmentsUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        treatment={selectedTreatment}
        onUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />
    </>
  );
}
