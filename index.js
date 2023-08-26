import express from 'express';

// Crear la app
const app = express();

// Routing

app.get('/', function(req, res) {
    res.send('Hola Mundo en express')
});

app.get('/nosotros', function(req, res) {
    res.send('Hola Mundo en express. NOSOTROS')
});

// Definir puerto

const port = 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});