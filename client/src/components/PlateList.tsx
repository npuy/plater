import { useState, useEffect, useCallback } from "react";
import { getPlates, getImageUrl } from "../services/api";
import type { Plate } from "../types";

interface PlateListProps {
  refreshTrigger: number;
}

export default function PlateList({ refreshTrigger }: PlateListProps) {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [plateNumberFilter, setPlateNumberFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const fetchPlates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        plate_number: plateNumberFilter || undefined,
        date_from: dateFromFilter || undefined,
        date_to: dateToFilter || undefined,
      };

      const data = await getPlates(filters);
      setPlates(data);
    } catch (err) {
      setError("Error al cargar las matrículas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [plateNumberFilter, dateFromFilter, dateToFilter]);

  useEffect(() => {
    fetchPlates();
  }, [fetchPlates, refreshTrigger]);

  const handleSearch = () => {
    fetchPlates();
  };

  const handleClearFilters = () => {
    setPlateNumberFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    // Recargar sin filtros
    getPlates().then(setPlates).catch(console.error);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Matrículas Registradas
      </h2>

      {/* Filtros */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              type="text"
              value={plateNumberFilter}
              onChange={(e) => setPlateNumberFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por matrícula"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desde
            </label>
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Lista de matrículas */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : plates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay matrículas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plates.map((plate) => (
            <div
              key={plate.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={getImageUrl(plate.image_path)}
                alt={`Matrícula ${plate.plate_number}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plate.plate_number}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Fecha:</span> {plate.date}
                </p>
                {plate.description && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Descripción:</span>{" "}
                    {plate.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Registrado:{" "}
                  {new Date(plate.created_at).toLocaleString("es-ES")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
