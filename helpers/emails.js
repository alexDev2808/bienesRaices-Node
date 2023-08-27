import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });


      const { email, nombre, token } = datos

    //   Enviar email
    await transport.sendMail({
        from: 'bienesraices@gmail.com',
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a> </p>

            <p>Si no fuiste tu, puedes ignorar este mensaje.</p>
        `
    })


}


export {
    emailRegistro
}