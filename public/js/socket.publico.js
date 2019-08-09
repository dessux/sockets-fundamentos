// Aquí va toda la lógica para la pantalla de tickets que ve la gente

var socket = io(); // io() - Función de la librería importada de socket.io

// Referencia a cada label ticket del html publico.html
var lblTicket1 = $('#lblTicket1');
var lblTicket2 = $('#lblTicket2');
var lblTicket3 = $('#lblTicket3');
var lblTicket4 = $('#lblTicket4');

var lblEscritorio1 = $('#lblEscritorio1');
var lblEscritorio2 = $('#lblEscritorio2');
var lblEscritorio3 = $('#lblEscritorio3');
var lblEscritorio4 = $('#lblEscritorio4');

var lblTickets = [lblTicket1, lblTicket2, lblTicket3, lblTicket4];
var lblEscritorios = [lblEscritorio1, lblEscritorio2, lblEscritorio3, lblEscritorio4];


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

// Mostrar el número de ticket en el lugar de (Cargando...) estadoActual es el evento
socket.on('estadoActual', function(data) {

    console.log('estadoActual data: ', data);

    actualizaHTML(data.ultimos4);
});

// Refrescar la pantalla publico.html cuando se de click en Atender siguiente ticket de pantalla escritorio.html
// 'ultimos4'
socket.on('ultimos4', function(data) {

    console.log('ultimos4 data: ', data);

    var audio = new Audio('../audio/new-ticket.mp3');

    actualizaHTML(data.ultimos4);

});


function actualizaHTML(ultimos4) {
    for (let i = 0; i <= ultimos4.length - 1; i++) {
        lblTickets[i].text('Ticket ' + ultimos4[i].numero);
        lblEscritorios[i].text('Escritorio ' + ultimos4[i].escritorio);
    }
}