import CartModel from "../Models/Cart.model.js";
import { ProductManager } from "./productManager.js";


export class CartManager {

    getCartAsync = async () => {
        const carts = await CartModel.find()
        return carts
    }

    getCartByIdAsync = async (cid) => {
        return await CartModel.findById(cid).populate('products.product')
    }

    addCartAsync = async () => {
        const newCart = new CartModel()
        newCart.save()
            .then((cart) => {console.log("carrito sin productos creado",cart)})
            .catch((error)=> {
                console.error('Error al crear el carrito:', error);
            })
    }

    addProductToCartAsync = async (cid,pid) => {
        try{

            const cartManager = new CartManager()
            const cart = await cartManager.getCartByIdAsync(cid) 

            if (!cart) {
                throw new Error ("Carrito no encontrado")
            }

            const productManager = new ProductManager()
            const product = await productManager.getProductByIdAsync(pid);

            if (!product) {
                throw new Error ("Producto no encontrado")
            }
            cart.products.push({product:pid,quantity:1})
            
            await cart.save()

            return cart;
        }
            catch (error) {
                throw new Error(error.message)
            }
        }

        deleteProductFromCartAsync = async (cid,pid) => {
            try {
    
                const cartManager = new CartManager()
                const cart = await cartManager.getCartByIdAsync(cid)
    
                if(!cart){
                throw new Error(`No se encontró el carrito con id ${cid}`)
                }
    
                const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    
                if (productIndex === -1) {
                    throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
                }
    
                cart.products.splice(productIndex, 1);
    
                await cart.save();
                return cart;
    
            } catch (error) {
        
                throw new Error(error.message);
            }
        }
    
     
        updateCartProductsAsync = async (cid,products) => {
    
            try {
                const cartManager = new CartManager()
                const cart = await cartManager.getCartByIdAsync(cid)
    
                if(!cart){
                    throw new Error (`No se encontro el carrito ${cid}`)
                }
                cart.products = products
    
                await cart.save()
    
                return
                
            }
            catch (error) {
                console.error("Error al actualizar el carrito:", error);
            }
        }
    
    
        updateProductQuantityAsync = async (cid, pid, quantity) => {
            try {
                
                const cartManager = new CartManager()
                const cart = await cartManager.getCartByIdAsync(cid);
                if (!cart) {
                    throw new Error(`No se encontró el carrito con ID ${cid}`);
                }
        
                const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
                
                if (productIndex === -1) {
                    throw new Error(`No se encontró el producto con ID ${pid} en el carrito`);
                }
        
                cart.products[productIndex].quantity = quantity;
        
                await cart.save();
        
                return cart;
    
            } catch (error) {
                throw new Error(error.message);
            }
        }
    
    
        deleteAllProductsFromCartAsync = async (cid) => {
    
            try{
    
                const cartManager = new CartManager()
                const cart = await cartManager.getCartByIdAsync(cid)
    
            if (!cart) {
                throw new Error(`No se encontró el carrito con ID ${cid}`);
            }
    
            cart.products = []
            await cart.save();
            }
            
            catch (error){
    
                console.error("Error al eliminar productos del carrito:", error);
                res.status(500).json({ status: 'error', message: 'No se pudo eliminar los productos del carrito' });
            }
        }

}

