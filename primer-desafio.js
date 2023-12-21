class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title,
            this.description = description,
            this.price = price,
            this.thumbnail = thumbnail,
            this.code = code,
            this.stock = stock,
            this.id = null
    }
}

class ProductManager {

    constructor() {
        this.products = []
    }

    checkCode(product) {
        return this.products.some(p => p.code === product.code)
    }
    //--------------------------------------------

    addProducts(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log("datos incompletos")
            return null
        }

        if (this.checkCode(product)) {
            console.log(`Código [${product.code}] ya usado`);
        }
        else {
            product.id = this.products.length + 1
            this.products.push(product)
            console.log(`Producto agregado con id ${product.id}`);
            //console.log(this.products);
            //console.log("vuelvo a escribir los productos" + this.products);
        }

    }

    getProducts() {
        return console.log(this.products)
    }

    getProductsById(id) {
        const prod = this.products.find(product => product.id === id);
        if (!prod) {
            console.log("NOT FOUND")
        }
        else {
            console.log(`producto encontrado con el id: ${id}`)
            console.log(prod)
        }
    }
}


let pm = new ProductManager()
let prod1 = new Product("producto 1", "producto 1", 100, "sin ruta", "aaaa", 10);
let prod2 = new Product("producto 2", "producto 1", 200, "sin ruta", "bbbb", 20);


pm.addProducts(prod1)
pm.addProducts(prod2)

pm.getProductsById(22);