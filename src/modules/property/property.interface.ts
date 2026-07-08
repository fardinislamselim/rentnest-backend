export interface ICreateProperty {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  images?: string[];
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  categoryId: string;
}

export interface IUpdateProperty {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  categoryId?: string;
}

export interface IUpdatePropertyStatus {
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
}
