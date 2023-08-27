import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();


// Conexion a la db
try {
    await db.authenticate()
    console.log("Conexion correcta a la base de datos");
} catch(error) {
    console.log(error);
}

// Habiliitar Pug

app.set('view engine', 'pug')
app.set('views', './views')


// Carpeta publica
app.use(express.static('public'))


// Routing
app.use('/auth', usuarioRoutes);


// Definir puerto

const port = 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});