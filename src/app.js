const express = require('express');
const {ProductManager} = require('./Managers/desafio-entregable-3.js'); //no olvidar {}

const app = express() //la variable app contiene todas las funcionalidades de express
const PORT = 8080;
app.use(express.urlencoded({extended:true}))

let pm = new ProductManager("./files/products.json")

app.get('/products',async (req,res) => {

    console.log("Recibida solicitud a /products");
    const productsGotten = await pm.getProductsAsync()

    let limit = req.query.limit; //en la url debe decir localhost:8080/products/?limite=3
    
    if (limit && !isNaN(limit) && productsGotten.length > limit) {
        console.log(limit)
        const limitedProductsList = productsGotten.slice(0, limit)  //slice crea un nuevo array que contiene los primeros -limit- elementos de products
        res.send({ limitedProductsList });
    }else{
        res.json(productsGotten)
    }

})



app.get("/products/:idProduct",async (req,res)=> {
    
    let idProduct = req.params.idProduct

    console.log(idProduct)
    console.log(typeof(idProduct))
    idProduct = parseInt(idProduct)
    console.log(typeof(idProduct))

    if(idProduct && !isNaN(idProduct)){        
        let productSelectedById = await pm.getProductsByIdAsync(idProduct)
        //res.json({productSelectedById})
        res.send(productSelectedById)
    } else {res.status(404).json({ error: "Producto no encontrado" })};

})


app.listen(PORT,()=>console.log(`Servidor escuchando desde puerto ${PORT}`))