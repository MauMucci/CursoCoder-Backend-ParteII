import express from 'express';
import { ProductManager } from '../Mongo/Managers/productManager.js';
import { ProductModel } from '../Mongo/Models/Product.model.js';

const viewsrouter = express.Router()



viewsrouter.get('/home', async (req,res) => {
          
     const {page,limit} = req.query

     try {
          const products = await ProductModel.paginate({},{limit,page})
          res.render('home',{products})
          
     } catch (error) {
          res.status(500).json({error})
          
     }
})


viewsrouter.get('/realTimeProducts',(req,res) => {
    
     res.render('realTimeProducts',{})
})


export default viewsrouter

