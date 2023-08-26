import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Crear la app
const app = express();

// Habiliitar Pug

app.set('view engine', 'pug')
app.set('views', './views')

// Routing
app.use('/auth', usuarioRoutes);


// Definir puerto

const port = 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});