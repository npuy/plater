import type { Plate, CreatePlateDTO } from "../types";

const API_URL = "http://localhost:3000/api";

export const createPlate = async (data: CreatePlateDTO): Promise<Plate> => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("plate_number", data.plate_number);
  formData.append("date", data.date);
  if (data.description) {
    formData.append("description", data.description);
  }

  const response = await fetch(`${API_URL}/plates`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al crear matrícula");
  }

  return response.json();
};

export const getPlates = async (filters?: {
  plate_number?: string;
  date_from?: string;
  date_to?: string;
}): Promise<Plate[]> => {
  const params = new URLSearchParams();
  if (filters?.plate_number)
    params.append("plate_number", filters.plate_number);
  if (filters?.date_from) params.append("date_from", filters.date_from);
  if (filters?.date_to) params.append("date_to", filters.date_to);

  const response = await fetch(`${API_URL}/plates?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Error al obtener matrículas");
  }

  return response.json();
};

export const getImageUrl = (imagePath: string): string => {
  return `http://localhost:3000${imagePath}`;
};
