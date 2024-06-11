import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { productsRouter } from './routes/products.router.js';
import viewsrouter from './routes/views.router.js';
import {cartsRouter} from './routes/carts.router.js'
import { Server } from 'socket.io';


const app = express() 
const PORT = 5000;
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando desde puerto  ${PORT}`))

const io = new Server(httpServer)

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
// app.use(express.static(path.resolve(__dirname, "/public")))
app.use(express.static(__dirname + "/public"))


//Routes
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/',viewsrouter)



//Handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')
// app.use(express.static(__dirname + 'public'))



//Websocket
io.on('connection',(socket) => {
    console.log(`Nuevo cliente conectado con el id ${socket.id}`);

    socket.on('saludo', data => {
        console.log("Hola desde servidor!")
    })

    
})