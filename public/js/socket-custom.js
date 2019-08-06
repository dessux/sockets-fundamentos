// Funciones que queremos se disparen cuando recibamos información del
// servidor o cuando queramos enviar información al servidor
var socket = io(); // io() - Función de la librería importada de socket.io
// Este io es el mismo objeto que se usa en el backend en server.js

// Definir un mensaje que me diga cuando estoy conectado con el servidor
// Cuando hay un canal abierto entre el servidor y el cliente
socket.on('connect', function() {
    console.log('Conectado al Servidor');
});

// Desconexiones al servidor
// on - para escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Emitir desde el Cliente y Escuchar en el Servidor
// Los emit son para enviar información
// socket.emit('enviarMensaje', '123') 
// Se puede enviar una cadena o un objeto {} como el siguiente:
// El servidor lo va a recibir cuando se emita enviarMensaje
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    // Retroalimentación de emisiones del cliente hacia el servidor.
    // Para saber si el cliente recibió bien la información o la guardo
    // satisfactoriamente en una BD se agrega una función de callbacl al emit
    //console.log('Se disparó el callback');
    console.log('Respuesta server: ', resp);
});

// Emitir desde el Servidor y Escuchar en el Cliente
// Escuchar información
socket.on('enviarMensaje', function(mensaje) {
    console.log('Servidor: ', mensaje);
})