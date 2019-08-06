// Cargar librería express
const express = require('express');

// Cargar el paquete de sockets
const socketIO = require('socket.io');

// socket.io no trabaja directamente con la aplicación express por lo que se
// requiere hacar algunas configuraciones y levantar directamente un servidor 
// http de node con el cual si trabaja sockets.io
const http = require('http');

// Cargar librería del path
const path = require('path');

// Inicializar el express
const app = express();

// Configuración sockets para definir el servidor para correr la aplicación
let server = http.createServer(app);

// Crear un path para compartirlo y hacer pública la carpeta public
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

// Usar el middleware para habilitar la carpeta pública y que todo el munda pueda acceder a ella
app.use(express.static(publicPath));

// IO - Esta es la comunicación del backend
// Inicializar socket.io
//let io = socketIO(server);

// Para poder usar io en el archivo server/sockets/socket.js pasamos la definición
// let io a module.exports.io y lo importamos dentro de socket.js
module.exports.io = socketIO(server);
// Decirle al archivo server.js que utilice socket.js
require('./sockets/socket');


/*
// Montar la aplicación (servidor) para escuchar un puerto en desarrollo o producción
// Directamente con express
app.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});
*/

// Montar la aplicación (servidor) para escuchar un puerto en desarrollo o producción
// para sockets.io ahora usando directamente http
server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});