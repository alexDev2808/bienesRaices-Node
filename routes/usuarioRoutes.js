import express from "express";

const router = express.Router();

// Routing

router.get('/login', function(req, res) {
    res.render('auth/login', {
        autenticado: true
    })
});



router.get('/nosotros', function(req, res) {
    res.send('Hola Mundo en express. NOSOTROS')
});

export default router