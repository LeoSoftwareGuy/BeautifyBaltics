import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import type { TreatmentCategory, TreatmentFormValues } from './master-treatments.types';

type MasterTreatmentsFormProps = {
  categories: readonly TreatmentCategory[];
  onAdd: (values: TreatmentFormValues) => void;
};

export function MasterTreatmentsForm({ categories, onAdd }: MasterTreatmentsFormProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');

  const canSubmit = !!category && !!name.trim() && price !== '' && duration !== '';

  const resetForm = () => {
    setCategory(null);
    setName('');
    setPrice('');
    setDuration('');
  };

  const handleAdd = () => {
    if (!canSubmit) {
      return;
    }
    onAdd({
      categoryId: category,
      name: name.trim(),
      price: typeof price === 'number' ? price : parseFloat(price),
      duration: typeof duration === 'number' ? duration : parseInt(duration, 10),
    });
    resetForm();
  };

  const handlePriceChange = (value: string | number) => {
    setPrice(value === '' ? '' : Number(value));
  };

  const handleDurationChange = (value: string | number) => {
    setDuration(value === '' ? '' : Number(value));
  };

  return (
    <Card withBorder radius="md">
      <Stack gap="md">
        <div>
          <Title order={3}>Add Treatment</Title>
          <Text c="dimmed" size="sm">
            Add beauty procedures you can perform
          </Text>
        </div>
        <SimpleGrid
          cols={{
            base: 1, xs: 2, sm: 3, lg: 5,
          }}
          spacing="md"
        >
          <Select
            label="Treatment Category"
            placeholder="Select category"
            searchable
            data={categories.map((categoryOption) => ({
              value: categoryOption.id,
              label: categoryOption.name,
            }))}
            value={category}
            onChange={setCategory}
          />
          <TextInput
            label="Service Name"
            placeholder="e.g., Classic Haircut"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <NumberInput
            label="Price (€)"
            placeholder="50"
            min={0}
            decimalScale={2}
            value={price}
            onChange={handlePriceChange}
          />
          <NumberInput
            label="Duration (min)"
            placeholder="30"
            min={5}
            step={5}
            value={duration}
            onChange={handleDurationChange}
          />
          <Box style={{ alignSelf: 'flex-end' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              disabled={!canSubmit}
              onClick={handleAdd}
              color="pink"
            >
              Add treatment
            </Button>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
