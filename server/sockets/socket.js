// Importar la variable io de server.js para poder utilizarla aquí
const { io } = require('../server');

// Funciones que queremos se disparen cuando recibamos información del
// cliente o cuando queramos enviar información al cliente
// Este io es el mismo objeto que se usa en el cliente en index.html

// Definir un mensaje que me diga cuando estoy conectado con el cliente
// Cuando hay un canal abierto entre el servidor y el cliente
io.on('connection', (client) => {
    console.log('Usuario conectado');

    // Detectar cuando se desconecta un usuario por que se cayó el internet o por
    // alguna razón perdimos la conexión, 

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    // El mensaje enviado por el cliente en enviarMensaje se recibe poer el servidor
    // en mensaje
    // Para responderle al cliente que todo salió bien, agregamos un callback
    // después del mensaje que es la función a llamar cuando se hace la acción
    client.on('enviarMensaje', (data, callback) => {
        console.log('Mensaje recibido del cliente: ', data);

        // transmitir mensaje del cliente a los demás clientes
        client.broadcast.emit('enviarMensaje', data);

        /*
                // Si se recibe mensaje.usuario responder al cliente
                if (mensaje.usuario) {
                    callback({
                        resp: 'TODO SALIO BIEN!'
                    });
                } else {
                    callback({
                        resp: 'TODO SALIO MAL!!!!!!!!'
                    });
                }
        */
    });

    // Emitir desde el Servidor y Escuchar en el Cliente
    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });

});