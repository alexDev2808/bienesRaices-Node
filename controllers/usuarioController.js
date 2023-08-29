import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        
    })
};

const autenticar = async (req,res) => {
    // Validar
    await check('email').isEmail().withMessage("El email es obligatorio").run(req)
    await check('password').notEmpty().withMessage("La contrasena es obligatoria").run(req)

    let resultado = validationResult(req)

    
    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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
    usuario.token = null
    usuario.confirmar = true

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'Tu cuenta se confirmo con exito!',
        error: false
    })

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recuperar acceso",
        csrfToken: req.csrfToken(),

    })
};

const resetPassword = async (req, res) => {
    // Validacion
    await check('email').isEmail().withMessage("Eso no parece un email").run(req)

    let resultado = validationResult(req)
    
    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: "Recuperar acceso",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Buscar usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne( { where: { email } } )

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: "Recuperar acceso",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
        })
    }

    // Generar un token y enviar un email
    usuario.token = generarId();
    await usuario.save();

    // Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Restablece tu contrasena',
        mensaje: 'Hemos enviado un Email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario) {
        res.render('auth/confirmar-cuenta', {
            pagina: 'Restablece tu contrasena',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar password
    res.render('auth/reset-password', {
        pagina: 'Restablece tu contrasena',
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async (req, res) => {
    // Validar password
    await check('password').isLength({min: 6}).withMessage("La contrasena debe tener al menos 6 caracteres").run(req)

    let resultado = validationResult(req)

    
    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu contrasena',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params
    const { password } = req.body


    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt );
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contrasena Restablecida',
        mensaje: 'La contrasena se guardo correctamente'
    })


}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
}