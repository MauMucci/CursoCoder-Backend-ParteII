import express from 'express';
import ProductManager from "../Managers/ProductManager.js";

const viewsrouter = express.Router()
const pm = new ProductManager("./data/products.json")
const products = await pm.getProductsAsync()


viewsrouter.get('/home',(req,res) => {

     res.render('home',{products})
})


viewsrouter.get('/realTimeProducts',(req,res) => {
    
     res.render('realTimeProducts',{})
})


export default viewsrouter

