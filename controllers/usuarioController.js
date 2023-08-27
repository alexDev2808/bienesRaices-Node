import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion"
        
    })
};

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear Cuenta"
    })
};

const registrar = async (req, res) => {
    // Validacion
    await check('nombre').notEmpty().withMessage("El nombre no puede estar vacio").run(req)
    await check('email').isEmail().withMessage("Eso no parece un email").run(req)
    await check('password').isLength({min: 6}).withMessage("La contrasena debe tener al menos 6 caracteres").run(req)
    await check('repetir_password').equals('password').withMessage("Las contrasenas no coinciden").run(req)


    let resultado = validationResult(req)

    
    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer datos
    const { nombre, email, password } = req.body;

    // Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar un usuario
    await Usuario.create({
        nombre,
        email,
        password,
        token: 13245,
        
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recuperar acceso"
    })
};

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}