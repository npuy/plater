export interface Plate {
  id: number;
  plate_number: string;
  image_path: string;
  date: string;
  description?: string;
  created_at: string;
}

export interface CreatePlateDTO {
  plate_number: string;
  date: string;
  description?: string;
}
