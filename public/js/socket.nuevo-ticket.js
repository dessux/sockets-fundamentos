// Aquí va toda la lógica para manejar los nuevos tickets

var socket = io(); // io() - Función de la librería importada de socket.io

var label = $('#lblNuevoTicket');

// Definir un mensaje que me diga cuando estoy conectado con el servidor
// Cuando hay un canal abierto entre el servidor y el cliente
socket.on('connect', function() {
    console.log('Conectado al Servidor');
});

// Desconexiones al servidor
// on - para escuchar
socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

// Mostrar el número de ticket en el lugar de Cargando... estadoActual es el evento
socket.on('estadoActual', function(resp) {

    console.log('resp: ', resp);

    // Módificar el contenido de la etiqueta lblNuevoTicket del html
    label.text(resp.actual);
});

// Listener para el botón "Generar nuevp ticket"
// Todos las botones al hacer click en la pantalla Cargando... van a disparar esta función
$('button').on('click', function() {
    //console.log('click');

    // Emitir desde el Cliente y Escuchar en el Servidor
    // Los emit son para enviar información
    // Se puede enviar una cadena o un objeto {} como el siguiente:
    // El servidor lo va a recibir cuando se emita enviarMensaje
    // No se manda algún parámetro, pero si se ejecutará una función de
    // callbak cuando termine (Recordar que del lado del servidor debe 
    // ejecutar el callback)
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        // Módificar el contenido de la etiqueta lblNuevoTicket del html
        label.text(siguienteTicket);
    });
    /*, {
        ticket: '1'
    }, function(resp) {
        // Retroalimentación de emisiones del cliente hacia el servidor.
        // Para saber si el cliente recibió bien la información o la guardo
        // satisfactoriamente en una BD se agrega una función de callbacl al emit
        //console.log('Se disparó el callback');
        console.log('Respuesta server: ', resp);
    });
*/

});