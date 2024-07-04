import express from 'express';
import { ProductManager } from '../Mongo/Managers/productManager.js';

const viewsrouter = express.Router()
//const pm = new ProductManager("./data/products.json")
//const products = await pm.getProductsAsync()

const pm = new ProductManager()

viewsrouter.get('/home', async (req,res) => {
     try {
          const products = await pm.getProductAsync()
          console.log("++++");
          res.render('home',{products})
          
     } catch (error) {
          res.status(500).json({error})
          
     }

})


viewsrouter.get('/realTimeProducts',(req,res) => {
    
     res.render('realTimeProducts',{})
})


export default viewsrouter

