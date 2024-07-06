import express from 'express';
import { ProductManager } from '../Mongo/Managers/productManager.js';
import { ProductModel } from '../Mongo/Models/Product.model.js';

const productsRouter = express.Router()
const productManager = new ProductManager()

//------------ GET ------------

productsRouter.get("/api/products",async (req,res) => {

    let {page,limit} = req.query

    try{
        const products = await ProductModel.paginate({}, {limit,page});    
        res.json({
            status:"success",
            ...products
        })
    }
        
        catch(error){
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error interno del servidor" });// OK error desde el servidor?
            }
        }
    )

    
productsRouter.get('/api/products/:pid', async (req, res) => {

    try {

        let pid = req.params.pid
        let productSelectedById = await productManager.getProductByIdAsync(pid);
        
        if (!productSelectedById) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(productSelectedById);
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(404).json({ error: "Producto no encontrado" });
    }
});


productsRouter.get('/products/:pid',async (req,res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductByIdAsync(pid);

        if (!product) {
            return res.status(404).render('notFound', { message: "Producto no encontrado" });
        }

        res.render('productDetail', { product }); // Renderiza la vista 'productDetails' con los detalles del producto
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).render('error', { message: "Error interno del servidor" });
    }

})

//------------ POST ------------
productsRouter.post('/api/products',async (req,res)=> {
    try {
        let newProduct = req.body;
        const isAdded = await productManager.addProductAsync(newProduct);
        if(isAdded){
            res.status(400).send({ status: "success", message: "producto agregado" });
        }
        else{
            res.status(200).send({status: "Not success, missing data"})
        }

    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

//------------ PUT ------------
productsRouter.put('/api/products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        let productToUpdate = req.body;

        const isUpdated = await productManager.updateProductAsync(pid, productToUpdate);
        if(isUpdated){
            res.send({ status: "success", message: "Producto actualizado" });
        }
        else{
            res.status(200).send({status: "Not success, missing data"})
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

//------------ DELETE ------------
productsRouter.delete('/api/products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;

        const isDeleted = await productManager.deleteProductAsync(pid);
        if(isDeleted){
            res.send({ status: "success", message: "Producto eliminado" });
        }

    } catch (error) {
        console.error("Error al borrar producto:", error);
        res.status(404).json({ error: "Producto no encontrado" });
    }
});



export { productsRouter };