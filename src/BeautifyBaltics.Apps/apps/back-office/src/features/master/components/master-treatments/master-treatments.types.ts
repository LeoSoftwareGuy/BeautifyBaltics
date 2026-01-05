export type TreatmentCategory = {
  id: string;
  name: string;
};

export type Treatment = {
  id: string;
  category: string;
  categoryName: string;
  name: string;
  price: number;
  duration: number;
  images: string[];
};

export type TreatmentFormValues = {
  categoryId: string;
  name: string;
  price: number;
  duration: number;
};
