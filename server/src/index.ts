import express from 'express';
import cors from 'cors';
import path from 'path';
import plateRoutes from './routes/plateRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api', plateRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Matrículas funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
