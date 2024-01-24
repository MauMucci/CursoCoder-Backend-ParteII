import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {productsRouter} from '../routes/products.router.js';
import {cartsRouter} from '../routes/carts.router.js'
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express() //la variable app contiene todas las funcionalidades de express
const PORT = 8080;


//Middlewares
app.use(express.json()) //El servidor podra recibir jsons en la request
app.use(express.urlencoded({extended:true}))//permite que se pueda enviar informacion desde la url. 
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)




app.listen(PORT,()=>console.log(`Servidor escuchando desde puerto ${PORT}`))