const express = require('express');
const {ProductManager} = require('./Managers/ProductManager.js');
const {Product} = require('./Models/Product.js');
import handlebars from 'express-handlebars'


const app = express() //la variable app contiene todas las funcionalidades de express
const PORT = 8080;

app.use(express.json()) //El servidor podra recibir jsons en la request
app.use(express.urlencoded({extended:true}))//permite que se pueda enviar informacion desde la url. 

let pm = new ProductManager("./files/products.json")


//------------ GET ------------
app.get('/',(req,res) => {
    res.send("hola desde el back")
})


app.get('/api/products/',async (req,res) => {

    try{
        console.log("Se mostrarán todos los productos");
    const productsGotten = await pm.getProductsAsync()

    let limit = req.query.limit; //en la url debe decir localhost:8080/products/?limite=3
    
    if (limit && !isNaN(limit) && productsGotten.length > limit) {
        console.log(limit)
        const limitedProductsList = productsGotten.slice(0, limit)  //slice crea un nuevo array que contiene los primeros -limit- elementos de products
        res.send({ limitedProductsList });
    }else{
        res.json(productsGotten)
    }
    }
    catch(error){
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });// OK error desde el servidor?

    }
    
})



app.get("/api/products/:pid",async (req,res)=> {
    
    try{
        let pid = req.params.pid

        pid = parseInt(pid)
    
        if(pid && !isNaN(pid)){        
            let productSelectedById = await pm.getProductsByIdAsync(pid)
            //res.json({productSelectedById})
            res.send(productSelectedById)
        } else {res.status(404).json({ error: "Producto no encontrado" })};
    }
   catch (error){
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
    }
})

//------------ POST ------------
app.post("/api/products/",async (req,res)=> {
    try {
        let newProduct = req.body;
        await pm.addProductsAsync(newProduct);
        res.status(400).send({ status: "success", message: "producto agregado" });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})


//------------ PUT ------------
app.put("/api/products/:pid",async(req,res)=> {
    try{
        let pid = req.params.pid
        let productToUpdate = req.body;
        await pm.updateProduct(pid,productToUpdate);
        res.status(400).send({status:"success",message:"producto actualizado"})
    }
    catch(error){
        console.log("error al agregar producto",error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

//------------ DELETE ------------
app.delete("/api/products/:pid",async (req,res) => {
    try{
        let pid = req.params.pid;
        await pm.deleteProduct(pid)
        res.status(400).send({status:"success",message:"producto eliminado"})
    }
    catch(error){
        console.log("error al BORRAR producto",error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})


app.listen(PORT,()=>console.log(`Servidor escuchando desde puerto ${PORT}`))