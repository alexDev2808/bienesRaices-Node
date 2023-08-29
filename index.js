import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar lectura de forms
app.use( express.urlencoded({extended: true}) )

// Habilitar Cookie Parser
app.use(cookieParser())


// Habilitar CSRF
app.use(csrf({cookie: true}))




// Conexion a la db
try {
    await db.authenticate();
    db.sync()
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
app.use('/', propiedadesRoutes);


// Definir puerto

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});