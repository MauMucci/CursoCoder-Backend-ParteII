import express from 'express';
import { CartManager } from '../src/Managers/CartManager.js';

const cartsRouter = express.Router();

let cm = new CartManager('./files/carts.json')


//------------ GET ------------
cartsRouter.get('/', (req, res) => {
    res.send("HOLIS DESDE ROUTER CARTS");
});



cartsRouter.get('/:cid',async(req,res) => {
    try {
        let cid = req.params.cid
        cid = parseInt(cid)
        
        if(cid && !isNaN(cid))
        {
            let cartSelectedById = await cm.getCartByIdAsync(cid)
            res.send(cartSelectedById)
        }
        else{
            res.status(404).json({error: "Carrito no encontrado"})
        }
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})











export {cartsRouter}
