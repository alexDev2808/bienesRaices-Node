import express from "express";

const router = express.Router();

// Routing

router.get('/', function(req, res) {
    res.send('Hola Mundo en express')
});

router.get('/nosotros', function(req, res) {
    res.send('Hola Mundo en express. NOSOTROS')
});

export default router