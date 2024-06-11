console.log("HOLA DESDE EL REAL TIME PRODUCTS");

const socket = io();

socket.emit('saludo',data => {
    console.log('Hola desde cliente', data)
})


// Si quieres escuchar una respuesta del servidor
socket.on('saludo', data => {
    console.log('Respuesta del servidor:', data);
});