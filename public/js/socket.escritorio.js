// Aquí va toda la lógica para manejar los escritorios que atienden los tickets

var socket = io(); // io() - Función de la librería importada de socket.io

// Obtener los parámetros de la url
// Es válida en javascript pero al parecer no se soporta en Internet Explorer o Edge
var searchParams = new URLSearchParams(window.location.search);
//console.log('searchParams: ', searchParams);
console.log('searchParams: ', searchParams.has('escritorio')); // Comprueba que escritorio viene dentro de la url

var label = $('#small');

// Si no existe escritorio dentro de la url se sale al index.html
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

// Si viene escritorio en la url
var escritorio = searchParams.get('escritorio');
console.log('escritorio: ', escritorio);
var label = $('small'); // asignar una referencia (label) a todos las etiquetas small de la página

// Agregar en la página escritorio.html el escritorio
//$('small').text(escritorio);
$('h1').text('Escritorio ' + escritorio);

// Crear el listenen del botón ('Atender siguiente ticket') para cuando se de click en el mismo
$('button').on('click', function() {
    // Llamar al socket
    socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) {

        if (resp === 'No hay tickets') {
            label.text(resp);
            alert(resp);
            return;
        }
        console.log('resp: ', resp);
        label.text('Ticket ' + resp.numero);
    });
})


// Definir un mensaje que me diga cuando estoy conectado con el servidor
// Cuando hay un canal abierto entre el servidor y el cliente
socket.on('connect', function() {
    console.log('Conectado al Servidor desde sockets.escritorio.js');
});

// Desconexiones al servidor
// on - para escuchar
socket.on('disconnect', function() {
    console.log('Desconectado del servidor desde sockets.escritorio.js');
});