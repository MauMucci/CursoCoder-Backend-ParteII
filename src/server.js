import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import __dirname from './utils.js';
import { productsRouter } from './routes/products.router.js';
import {cartsRouter} from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { ProductManager } from './Mongo/Managers/productManager.js';

const app = express() 
const PORT = 5000;
const httpServer = app.listen(PORT, ()=>console.log(`Servidor escuchando desde puerto  ${PORT}`))

const io = new Server(httpServer)

const pm = new ProductManager()
const mongoUri = "mongodb://127.0.0.1:27017/ecommerce"


//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

//Session
app.use(session({
    secret:"s3cr3t",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        ttl: 60
    })
}))

//Routes
app.use('/',productsRouter)
app.use('/',cartsRouter)
app.use('/',viewsRouter)
app.use('/',sessionRouter)


//Handlebars
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','handlebars')
app.use(express.static(path.join(__dirname, 'public')));


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
mongoose.connect(mongoUri)
.then(console.log("CONECTADO A LA BASE DE DATOS"))
.catch(error => {
    console.log("ERROR AL CONECTARSE A LA BASE DE DATOS")
    console.log(error)
})

    
