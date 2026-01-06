import { useMemo, useState } from 'react';
import {
  Box,
  Container,
  ScrollArea,
  Stack,
} from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import CategoryFilters from './components/explore-category-filters';
import FiltersDrawer from './components/explore-filters-drawer';
import ExploreHeader from './components/explore-header';
import MapPlaceholder from './components/explore-map-placeholder';
import MasterCard from './components/explore-master-card';
import { CATEGORIES, type MasterCategory, SAMPLE_MASTERS } from './types';

function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MasterCategory>('all');
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const filteredMasters = useMemo(() => SAMPLE_MASTERS.filter((master) => {
    const categoryMatch = selectedCategory === 'all' || master.category === selectedCategory;
    const priceMatch = master.priceValue >= priceRange[0] && master.priceValue <= priceRange[1];
    return categoryMatch && priceMatch;
  }), [selectedCategory, priceRange]);

  const handleSelectMaster = (masterId: number) => {
    setSelectedMaster(masterId);
    navigate({ to: '/master/$masterId', params: { masterId: String(masterId) } });
  };

  return (
    <Box bg="var(--mantine-color-body)">
      <ExploreHeader onOpenFilters={() => setDrawerOpen(true)} />

      <Container size="lg" py="xl">
        <CategoryFilters
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <Box
          display="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          <ScrollArea h="calc(100vh - 280px)" type="always" offsetScrollbars>
            <Stack gap="md" pr="sm">
              {filteredMasters.map((master) => (
                <MasterCard
                  key={master.id}
                  master={master}
                  selected={selectedMaster === master.id}
                  onSelect={handleSelectMaster}
                />
              ))}
            </Stack>
          </ScrollArea>

          <MapPlaceholder />
        </Box>
      </Container>

      <FiltersDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
      />
    </Box>
  );
}

export default ExplorePage;
