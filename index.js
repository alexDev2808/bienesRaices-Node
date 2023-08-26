import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Crear la app
const app = express();

app.use('/', usuarioRoutes);

// Definir puerto

const port = 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});