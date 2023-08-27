import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

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
    await check('repetir_password').equals(req.body.password).withMessage("Las contrasenas no coinciden").run(req)


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
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),

    })

    // Envia email de confirmacion

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion

    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un Email de confirmacion a tu cuenta, presiona el enlace'
    })



}

// Funcion que comprueba una cuenta

const confirmar = async (req, res) => {
    const { token } = req.params;

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }
    // Confirmar la cuenta

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
    confirmar,
    formularioOlvidePassword
}