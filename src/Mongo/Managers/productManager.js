import { ProductModel } from "../Models/Product.model.js";

export class ProductManager {
    
    getProductAsync = async () => {
        const products =  await ProductModel.find()
        return products
    }

    getProductByIdAsync = async (pid) => {
        return await ProductModel.findById(pid)
    }

    addProductAsync = async ({title,description,thumbnail,code,stock,price,status}) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("DATOS INCOMPLETOS PARA AGREGAR EL PRODUCTO")            
            return null
        }
        return await ProductModel.create({title,description,thumbnail,code,stock,price,status})
        }

    updateProductAsync = async (pid,productToReplace) => {
        if (!productToReplace.title || !productToReplace.description || !productToReplace.price || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock) {
            console.log("DATOS INCOMPLETOS PARA SOBRESCRIBIR EL PRODUCTO")
            return null
        }
        return await ProductModel.updateOne({_id: pid},productToReplace)
    }

    deleteProductAsync = async (pid) => {       
        return await ProductModel.deleteOne({_id: pid})
    }
}