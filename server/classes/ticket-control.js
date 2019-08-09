// Grabar archivo de datos nconfiguración
const fs = require('fs');


// Clase para manejar los tickets pendientes
class Ticket {

    // Variables necesarias para poder crear un ticket:
    // numero - número de ticket a atender
    // escritorio - escritorio que atiende a la persona
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0; // Último ticket que se dió
        this.hoy = new Date().getDate();
        //        console.log('hoy: ', this.hoy);

        // Arreglo con todos los tickets pendientes de revisión (Todos los tickets que no han sido atendidos por nadie)
        this.tickets = [];

        // Arreglo para los últimos 4 tickets mostrados en pantalla
        this.ultimos4 = [];

        // Si se cae (reinicia) el servidor por cualquier cause, se guardan datos como el 
        // último ticket para no perder el número en el que vamos.

        // Leer archivo json
        let data = require('../data/data.json');

        //console.log('data: ', data);

        // Cada día se reinicia el proceso
        if (data.hoy === this.hoy) {
            // Continuar el trabajo existente
            this.ultimo = data.ultimo; // Retomar el valor del último ticket para mantenerlo de manera persistente
            //            console.log('Mismo día');
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            // Es un nuevo día
            // Reiniciar todo
            //            console.log('reiniciarConteo');
            this.reiniciarConteo();
        }
    }

    // Determinar el siguiente ticket, (Grabamos el siguiente ticket)
    // Incrementar en uno el último ticket
    siguiente() {

        this.ultimo += 1; // Asignar el siguiente ticket

        // Crear una nueva instancia de ticket
        // Se crea el ticket con el último ticket en turno
        // escritorio = null. Cuando se crea un ticket no se sabe todavìa que escritorio lo va a atender
        let ticket = new Ticket(this.ultimo, null);

        //        console.log('Antes de cargar arreglo');
        //        console.log('ticket: ', ticket);
        //        console.log('tickets: ', this.tickets);

        // Agregar el ticket al arreglo de tickets
        //        console.log('Agregando al arreglo...');

        // MOB: Se agrega validación por mensaje de tickets undefined 
        // Y no puede hacer push sobre un arreglo no definido. (TypeError: Cannot read property 'push' of undefined)
        if (typeof this.tickets === 'undefined') {
            //            console.log('tickets No Está Definida');
            this.tickets = [];
        }

        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${ this.ultimo }`;

    }

    // Obtener el último ticket
    getUltimoTicket() {

        return `Ticket ${ this.ultimo }`;

    }

    // Obtener los últimos 4 ticket
    getUltimos4() {

        return this.ultimos4;

    }

    // Param. escritorio - escritorio al cual se le quiere asignar un ticket
    atenderTicket(escritorio) {

        // MOB: Se agrega validación por mensaje de tickets undefined 
        // Y no puede hacer length sobre un arreglo no definido. (TypeError: Cannot read property 'length' of undefined)
        if (typeof this.tickets === 'undefined') {
            //            console.log('tickets No Está Definida');
            this.tickets = [];
        }

        // Si no hay tickets pendientes, no hacer nada
        if (this.tickets.length === 0) {
            return 'No hay tickets'; // Se puede mandar un { ok : false, message: 'No hay tockets' }
        }

        // Tomar el primer ticket que se encuentre en el arreglo de tickets
        var numeroTicket = this.tickets[0].numero;
        //        } else {
        //            var numeroTicket = 1;
        //            console.log('numeroTicket: ', numeroTicket);
        //        }
        // Borrar el ticket (Ya atendido)
        this.tickets.shift(); // Elimina el primer elemento

        // Instancia de un nuevo ticket (porque es el que se quiere atender)
        // se atiende el ticket numeroTicket obtenido y el escritorio que lo va a atender (pasado por param.)
        let atenderTicket = new Ticket(numeroTicket, escritorio);

        // Poner el ticket a atender al inicio del arreglo de los últimos 4
        this.ultimos4.unshift(atenderTicket); // Pon atenderTicket al inicio del arreglo

        // Si el arreglo ya tiene mas de 4 elementos (tickets), se debe ir borrando
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); // Borra el último elemento
        }

        console.log('Últimos 4: ', this.ultimos4);

        // Grabar enla BD (en el archivo)

        this.grabarArchivo();

        return atenderTicket;
    }

    reiniciarConteo() {

        this.ultimo = 0;
        // Vaciar el arreglo de tickets
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');

        this.grabarArchivo();

    }

    grabarArchivo() {

        // Información a grabar
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            ticket: this.tickets, // Grabar los tickets pendientes de atender
            ultimos4: this.ultimos4 // Grabar los últimos 4 tickets en atención o en espera
        };

        // Mandar json como un string
        let jsonDataString = JSON.stringify(jsonData);
        console.log('jsonDataString: ', jsonDataString);

        // Grabar datos jsonDataString en archivo de texto
        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }

}






module.exports = {
    TicketControl
}