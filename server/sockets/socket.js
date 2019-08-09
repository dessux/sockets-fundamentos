// Importar la variable io de server.js para poder utilizarla aquí
const { io } = require('../server');

// Importar la clase de Control de Tickets
const { TicketControl } = require('../classes/ticket-control');

// Instancia de la clase TicketControl (para poder utilizarla)
const ticketControl = new TicketControl();


// Funciones que queremos se disparen cuando recibamos información del
// cliente o cuando queramos enviar información al cliente
// Este io es el mismo objeto que se usa en el cliente en index.html

// Definir un mensaje que me diga cuando estoy conectado con el cliente
// Cuando hay un canal abierto entre el servidor y el cliente
io.on('connection', (client) => {
    console.log('Usuario conectado');

    // Detectar cuando se desconecta un usuario por que se cayó el internet o por
    // alguna razón perdimos la conexión, 

    //    client.on('disconnect', () => {
    //        console.log('Usuario desconectado');
    //    });

    // Escuchar el cliente
    // El mensaje enviado por el cliente en siguienteTicket se recibe por el servidor
    // en data
    // Para responderle al cliente que todo salió bien, agregamos un callback
    // después del mensaje que es la función a llamar cuando se hace la acción
    client.on('siguienteTicket', (data, callback) => {

        //        console.log('ini client.on("siguienteTicket")');

        // Obtener el siguiente ticket
        let siguiente = ticketControl.siguiente();

        //        console.log('regreso de icketControl.siguiente()');

        //        console.log('siguiente: ', siguiente);
        // Ya se tiene el ticket (siguiente) y ahora se debe llamar el callback con el siguiente
        callback(siguiente); // LLama a ejecución la función callback en el cliente (sockets.nuevo-ticket.js)

        /*        
                console.log('Cuál es el siguiente ticket?: ', data);

                // transmitir mensaje del cliente a los demás clientes
                client.broadcast.emit('siguienteTicket', data);


                // Si se recibe mensaje.usuario responder al cliente
                if (data.usuario) {
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

    // Emitir desde el Servidor y Escuchar en el Cliente. estadoActual es el evento
    // Para obtener mas información para la pantalla de Tickets al Público se agrega el
    // llamado a una función de ticketControl
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    // Escuchar evento atenderTicket
    // En data se recibe el escritorio,
    // callback para notificar cuando ya se haga el proceso
    client.on('atenderTicket', (data, callback) => {
        // Confirmar que en la data venga el escritorio
        if (!data.escritorio) { // No viene el escritorio
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        // Llamar a atenderTicket que nos dice cual es el ticket que toca atender
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        // Retornar la información del ticket a atender por el escritorio para
        // que la persona en el frontend lo pueda trabajar
        callback(atenderTicket);

        // Actualizar / notificar cambios en los ULTIMOS 4 tickets 
        // Actualizar la pantalla que todo el mundo está viendo
        // emitir 'ultimos4'
        // Si solo se usa client.emit('ultimos4') el emit solo va a llegarle
        // a la persona o al cliente que lo está recibiendo, por lo que para que 
        // le llegue a toda la gente que está escuchando se usa un broadcast 
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });

    });

});