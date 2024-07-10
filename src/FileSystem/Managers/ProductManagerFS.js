import fs from 'fs'
import { Product } from '../Models/products.model.js';


//let idIncrementado = 0;

export default class ProductManager {

    constructor(file) {
        this.products = []
        this.filePath = file;
    }

    checkCode(product) {
        return this.products.some(p => p.code === product.code)
    }

    async saveProductsOnFile(){
        try{
            await fs.promises.writeFile(this.filePath,JSON.stringify(this.products,null,2)) //agrega una sangria de 2 estados
            console.log("Productos guardados correctamente en el archivo");
        }
        catch (error){
            console.error('Error escribiendo en el archivo:', error);
        }
    }

    async loadProductsFromFile() {
        try {
            const fileContent = await fs.promises.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(fileContent);
            
            return fileContent;
            
        }catch (error) {
            if (error.code === 'ENOENT') {
                console.warn("Archivo no encontrado, inicializando lista de productos vacía.");
                this.products = [];
            }
            else{
                console.error("error cargando productos desde el archivo",error)
            }
        }
    }

    async addProductsAsync(product) {
        
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category==null) {
            console.log("datos incompletos")
            return null
        }

        if (this.checkCode(product)) {
            console.log(`Código [${product.code}] ya usado`);
        }
        else {
            await this.loadProductsFromFile();

            if(this.products.length === 0){//Si no hay productos en el arreglo => le asignamos el id 1
                product.id = 1;            
                console.log("Primer producto agregado correctamente " + product.title + " id: "+ product.id)  
            }
                else{
                    await this.loadProductsFromFile();
                    const lastProduct = this.products [this.products.length-1] 
                    product.id = lastProduct.id + 1;           
                }
           
            this.products.push(product) 
            await this.saveProductsOnFile(); 
        }
        
    }

    async getProductsAsync() {
        await this.loadProductsFromFile();
        console.log("++++ Productos ++++")
        console.log(this.products) 
        return this.products    
    }       

    async getProductsByIdAsync(id) {

        await this.loadProductsFromFile();
        const product = this.products.find(product => product.id === id)
        if(!product){
            console.log(`Producto con ID ${id} no encontrado desde getProductsByIdAsync`)
        } else{
           // console.log(`Producto encontrado con el id: ${id} desde getProductsByIdAsync`)
            return product
        }
}

async updateProduct(id, updatedFields) {
    try {
        await this.loadProductsFromFile();

        const index = this.products.findIndex(product => product.id === parseInt(id)); //Importante parsear id

        if (index === -1) {
            console.log(`Producto con ID ${id} no encontrado. No se actualizará.`);
            return
        } else {


            // Asegurar que el ID no se modifica
            const updatedProduct = {
                ...this.products[index],
                ...updatedFields,
                id: this.products[index].id,
            };

            this.products[index] = updatedProduct

            console.log(`Producto con ID ${id} actualizado correctamente.`);
            // Guardar la lista actualizada en el archivo y devolver la promesa
            await this.saveProductsOnFile();
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;  // Propaga el error para que pueda ser manejado externamente
    }
}


async deleteProduct(id) {
    await this.loadProductsFromFile();
    const index = this.products.findIndex(product => product.id === parseInt(id));

    if (index === -1) {
        console.log(`Producto con ID ${id} no encontrado. No se eliminará.`);
    } else {

        const deletedProduct = this.products.splice(index, 1)[0];
        console.log(`Producto con ID ${id} eliminado correctamente.`);
        await this.saveProductsOnFile();
        return deletedProduct;
    }

}
}


let pm = new ProductManager("./data/products.json")

const prod1 = new Product(
    "Apple",
    "iPhone SE Plus",
    "Edición especial con potente chip, cámara avanzada y soporte para 5G.",
    "ARS 29,999",
    "APSEPLUS-ARG",
    100,
    "Smartphones"
  );
const prod2 = new Product(
    "LG",
    "LG Vortex Pro",
    "Teléfono con diseño elegante, sistema de audio premium y funciones de grabación avanzadas.",
    "ARS 19,999",
    "LGVPRO-ARG",
    120,
    "Smartphones"

  );

const prod3 = new Product(
    "Motorola",
    "MotoG Fusion",
    "Smartphone con pantalla infinita, cámara versátil y batería de larga duración.",
    "ARS 17,499",
    "MGFUSION-ARG",
    180,
    "Smartphones"

  );

const prod4 = new Product(
    "Samsung",
    "Galaxy A90 Neo",
    "Smartphone con pantalla Super AMOLED, triple cámara y carga rápida.",
    "ARS 21,799",
    "SGA90NEO-ARG",
    150
  );

const prod5 = new Product(
    "TCL",
    "TCL 10L Lite",
    "Smartphone asequible con pantalla HD, rendimiento eficiente y diseño moderno.",
    "ARS 10,499",
    "TCL10LLITE-ARG",
    220
  );

const prod6 = new Product(
    "Xiaomi",
    "Redmi Note X",
    "Teléfono con procesador Snapdragon, cámara cuádruple y batería de alta capacidad.",
    "ARS 14,999",
    "XMREDMINX-ARG",
    200
  );


// pm.addProductsAsync(prod1)
//pm.addProductsAsync(prod2)
//pm.addProductsAsync(prod3)
//pm.addProductsAsync(prod4)
//pm.addProductsAsync(prod5)
//pm.addProductsAsync(prod6)

//pm.getProductsAsync()
//pm.getProductsByIdAsync(4);
//pm.updateProduct(1, { title: "Mauro"});
//pm.deleteProduct(1);
