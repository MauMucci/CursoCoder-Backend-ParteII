import fs from 'fs'
import { ProductManager } from './ProductManager.js';

const pm = new ProductManager()

export class CartManager{

    constructor(file){
        this.carts = [];
        this.filePath = file;
    }

    async loadCartsFromFile() {
        try{
            const fileContent = await fs.promises.readFile(this.filePath, 'utf-8');

            if (!fileContent.trim()) { //verifica que este vacio
                console.log("El archivo está vacío o no contiene datos JSON. Creando un nuevo arreglo vacío.");
                return [];
            }
        
        this.carts = JSON.parse(fileContent);
        console.log("Carritos de compras cargados correctamente");
        return this.carts;

        }

        catch (error) {

            console.error("Error cargando carritos de compras desde el archivo ", error);
            this.code = [];
            return null

        }
    }

    async saveCartOnFile(){
        try{
            await fs.promises.writeFile(this.filePath,JSON.stringify(this.carts,null,2))
            console.log(("carrito de compras GUARDADO correctamente"))
        }
        catch(error){
            console.error('Error escribiendo en el archivo:', error);
        }
    }

    
    async getCartsAsync() {
        await this.loadCartsFromFile();
        console.log("++++ Carrito de compras ++++")
        console.log(this.carts) 
        return this.carts  
    }

    async addCartAsync() {
        this.carts = await this.loadCartsFromFile()
        const cart = {
            id: null,
            products: []
        };

        if(this.carts.length === 0){//Si no hay carritos en el arreglo => le asignamos el id 1
            cart.id = 1;    
            console.log("primer carrito agregado")
        }
        else{       
            const lastCart = this.carts [this.carts.length-1] 
            cart.id = lastCart.id + 1; 
        }
        this.carts.push(cart)
        await this.saveCartOnFile();

    }

    async getCartByIdAsync(cid) {
        await this.loadCartsFromFile();
        return this.carts.find(cart => cart.id === cid);
      }


    async addProductToCartAsync(cid, pid) {

        await this.loadCartsFromFile();
        
        const cartSelected = this.carts.find(c => c.id === cid); 
        console.log(`Carrito encontrado con el id ${cid},${cartSelected.id}`);
    
        if (!cartSelected) {
            console.log(`Carrito con ID ${cid} no encontrado.`);
            return null;
        }
        //const existingProduct = cartSelected.products.find(product => product.id === pid);
      
        const existingProduct = cartSelected.products.find(p => p.product === pid)
        //console.log(existingProduct.pid,existingProduct)

        if (existingProduct) {
            existingProduct.quantity = existingProduct.quantity + 1;
        }
        else {
            cartSelected.products.push({ product: pid, quantity: 1 });
        }
        await this.saveCartOnFile();
        return cartSelected;
        }


}


const cm = new CartManager("./files/carts.json")


//cm.loadCartsFromFile();
//cm.getCartsAsync();
//cm.addCartAsync()
//cm.addProductToCartAsync(1,1)

//cm.addProductToCartAsync(1,1)


//