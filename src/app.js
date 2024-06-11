import express from 'express';
import handlebars from 'express-handlebars'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { productsRouter } from './routes/products.router.js';
import viewsrouter from './routes/views.router.js';
import {cartsRouter} from './routes/carts.router.js'
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express() 
const PORT = 5000;


//Middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/',viewsrouter)


//Handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname + '/public'))


app.listen(PORT,()=>console.log(`Servidor escuchando desde puerto  ${PORT}`))