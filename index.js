const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json()); // Para procesar el cuerpo de las solicitudes JSON

// Configura Nodemailer para el envío de correos
const transporter = nodemailer.createTransport({
  service: 'gmail', // Utiliza Gmail; puedes cambiar esto a otro servicio
  auth: {
    user: 'admin@playonworlds.games', // Cambia esto por tu correo
    pass: 'djse abuf tngr dzdi'       // Cambia esto por tu contraseña o clave de app
  }
});

// Endpoint que recibirá el webhook de NocoDB
app.post('/webhook', async (req, res) => {
  const { updatedData, oldData } = req.body; // Datos que envía NocoDB

  // Verifica si el valor de la lista desplegable ha cambiado
  if (updatedData.dropdownField && updatedData.dropdownField !== oldData.dropdownField) {
    const emails = updatedData.targetCellEmails; // Los correos de los usuarios en esa celda específica
    const newDropdownValue = updatedData.dropdownField;

    try {
      await transporter.sendMail({
        from: 'admin@playonworlds.games',
        to: emails,
        subject: `Actualización en la lista desplegable`,
        text: `El valor de la lista desplegable ha cambiado a: ${newDropdownValue}`
      });
      console.log('Correo enviado exitosamente');
      res.status(200).send('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      res.status(500).send('Error al enviar correo');
    }
  } else {
    res.status(200).send('No se realizaron cambios en la lista desplegable');
  }
});

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
