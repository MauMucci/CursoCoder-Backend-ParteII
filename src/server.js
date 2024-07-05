import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { productsRouter } from './routes/products.router.js';
import viewsrouter from './routes/views.router.js';
import {cartsRouter} from './routes/carts.router.js'
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express() 
const PORT = 5000;
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando desde puerto  ${PORT}`))

const io = new Server(httpServer)

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))


//Routes
app.use('/',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/',viewsrouter)


//Handlebars
//app.engine('handlebars',handlebars.engine())

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        
    }
}));

app.set('views',__dirname + '/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname + 'public'))

//Websocket
io.on('connection',(socket) => {

    //console.log(`Nuevo cliente conectado con el id ${socket.id}`);

    //Evento para agregar productos
    socket.on("addProduct", async product => {  
        await pm.addProductsAsync(product);
        const products = await pm.getProductsAsync(); 
        io.emit('updateProducts', products);
    });

    //Evento para borrar productos
    socket.on('deleteProduct',async productId => {
        await pm.deleteProduct(productId)
        const products = await pm.getProductsAsync()
        io.emit('updateProducts',products)
    })
})

//Mongoose
const mongoUri = "mongodb://127.0.0.1:27017/ecommerce"
mongoose.connect(mongoUri)
.then(console.log("CONECTADO A LA BASE DE DATOS"))
.catch(error => {
    console.log("ERROR AL CONECTARSE A LA BASE DE DATOS")
    console.log(error)
})

    
