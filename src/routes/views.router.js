import express from 'express';
import { ProductManager } from '../Mongo/Managers/productManager.js';
import { ProductModel } from '../Mongo/Models/Product.model.js';

const viewsRouter = express.Router()

viewsRouter.get('/home', async (req,res) => {
          
     const {page=1,limit=5} = req.query 
     const isSession = req.session.user ? true : false

     try {
          const products = await ProductModel.paginate({},{limit,page})
          res.render('home',{products})
          
     } catch (error) {
          res.status(500).json({error})
          
     }
})


viewsRouter.get('/realTimeProducts',(req,res) => {
     res.render('realTimeProducts',{})
})



viewsRouter.get("/", (req,res) => {
     const isSession = req.session.user ? true: false
     res.render("index",{title:"Inicio",isSession})
})

viewsRouter.get("/login",(req,res) => {
     const isSession = req.session.user ? true:false;

     if(isSession){
          return res.redirect("/")
     }

     res.render("login",{title:"Login"})
})

viewsRouter.get("/register",(req,res) => {
     const isSession = req.session.user ? true:false

     if(isSession){
          return res.redirect("/")
     }

     res.render("register",{title:"Registro"})
})

viewsRouter.get("/profile", (req, res) => {
     const isSession = req.session.user ? true : false;
   
     if (!isSession) {
       return res.redirect("/");
     }
   
     res.render("profile", { title: "Perfil", user: req.session.user });
   });






export default viewsRouter

