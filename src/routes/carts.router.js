import express from 'express';
import { CartManager } from '../Mongo/Managers/cartsManager.js';
import { ProductManager } from '../Mongo/Managers/productManager.js';



const cartsRouter = express.Router();

const cartManager = new CartManager()
const productManager = new ProductManager()


//------------ GET ------------

cartsRouter.get('/api/carts',async (req,res) => {

  try {
    let carts = await cartManager.getCartAsync()
    res.send(carts)
  } catch (error) {
    
    res.status(500).json({ error: "Error interno del servidor" });
  }
})


cartsRouter.get('/api/carts/:cid',async(req,res) => {
    try {
        let cid = req.params.cid

        if(cid)
        {
            let cartSelectedById = await cartManager.getCartByIdAsync(cid)
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

cartsRouter.get('/carts/:cid',async(req,res) => {
  try {
      let cid = req.params.cid

      if(cid)
      {
          let cartSelectedById = await cartManager.getCartByIdAsync(cid)
          res.render('cartDetail',{ cart: cartSelectedById })
      }
      else{
          res.status(404).json({error: "Carrito no encontrado"})
      }
  } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
})



//------------ POST ------------
//PARA CREAR UN CARRITO SIN PRODUCTOS
cartsRouter.post('/api/carts/',async(req,res) => {
  try {

    const newCart = await cartManager.addCartAsync()
    res.status(201).json({ message: "Carrito creado exitosamente", cart: newCart })
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
    
  }
})



cartsRouter.post('/api/carts/:cid/product/:pid',async(req,res) => {

    try{
      console.log("1- Entro al endpoint")
        const cid = req.params.cid       
        const pid = req.params.pid  
     
        if(cid && pid)
        {                       
            console.log(`Carrito: ${cid} Producto: ${pid} desde POST`)  
            const cartSelectedById = await cartManager.getCartByIdAsync(cid)     

            if (cartSelectedById) {
              const productSelectedById = await productManager.getProductByIdAsync(pid);                

              if (productSelectedById) {
                await cartManager.addProductToCartAsync(cartSelectedById._id, productSelectedById._id);
                console.log("Producto agregado al carrito correctamente");
                res.status(200).json({ message: "Producto agregado al carrito correctamente" });
                } else {
                  res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
                  }
                } else {
                  res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
                }
              } else {
                res.status(400).json({ error: "Parámetros inválidos en la solicitud" });
              }
            }
            catch(error){
                console.error("Error al agregar carrito de compras", error);
                res.status(500).json({ error: "error" });
            }
        })
           


//------------ DELETE ------------
cartsRouter.delete('/api/carts/:cid/products/:pid',async(req,res) => {
  try{
  let {cid} = req.params
  let {pid} = req.params
  const cartDeleted = await cartManager.deleteProductFromCartAsync(cid,pid)
  res.send({cartDeleted:"sucess",payload: cartDeleted})

  }
  catch{(error) 
    res.status(500).send({ status: "error", message: `Error al eliminar el producto del carrito ${cid}`, error: error.message });
  }
})

cartsRouter.delete('/api/carts/:cid',async (req,res) => {

  try {
      let {cid} = req.params
      const cartDeleted = await cartManager.deleteAllProductsFromCartAsync(cid)

      res.send({status: "Success",message: `Se eliminaron todos los productos del carrito ${cid}`,payload:cartDeleted})

  } catch (error) {
      res.status(500).send({ status: "error", message: `Error al eliminar los producto en el carrito ${cid}`, error: error.message });
  }
})

//------------ PUT ------------
cartsRouter.put('/api/carts/:cid',async (req,res) => {
  try {
    let {cid} = req.params
    let {products} = req.body
    let cartUpdated = await cartManager.updateCartProductsAsync(cid,products)

    res.send({cartUpdated:"success",payload: cartUpdated})

  } catch (error) {
    
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ message: 'Error al actualizar el carrito', error: error.message });
    
  }
})

cartsRouter.put('/api/carts/:cid/products/:pid',async(req,res) => {

  try{
      let {cid} = req.params
      let {pid} = req.params
      let {quantity} = req.body

      const cartUpdated = await cartManager.updateProductQuantityAsync(cid,pid,quantity)
  
      res.send({ status: "success", message: "Cantidad de ejemplares del producto actualizada correctamente", payload: cartUpdated });
  
  } catch (error) {
      res.status(500).send({ status: "error", message: "Error al actualizar la cantidad de productos en el carrito", error: error.message });
  }})


export {cartsRouter}
