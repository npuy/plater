import { useState } from "react";
import PlateForm from "./components/PlateForm";
import PlateList from "./components/PlateList";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    // Incrementar el trigger para actualizar la lista
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Sistema de Registro de Matrículas
          </h1>
          <p className="text-blue-100 mt-2">
            Administra y busca matrículas de forma sencilla
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <PlateForm onSuccess={handleSuccess} />
          </div>

          {/* Lista */}
          <div className="lg:col-span-2">
            <PlateList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Sistema de Registro de Matrículas - 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
