import express from 'express';
import ProductManager from "../Managers/ProductManager.js";



const viewsrouter = express.Router()


const pm = new ProductManager("./data/products.json")
const products = await pm.getProductsAsync()


//Get para prueba de handlebars
viewsrouter.get('/',(req,res) => {
    
     res.render('index',{products})
})


export default viewsrouter

