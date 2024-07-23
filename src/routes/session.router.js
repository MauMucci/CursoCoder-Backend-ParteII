import { Router } from "express";
import { userModel } from "../Mongo/Models/user.model.js";

const sessionRouter = Router()

sessionRouter.post("/api/sessions/login",async(req,res) => {
    const {email,password} = req.body

    if(!email || !password)
    {
        return res.status(400).json({message: "Todos los campos son requeridos"})
    }

    try {
        const user = await userModel.findOne({email})

        if(!user){
            return res.sendStatus(404).json({message:"Usuario no encontrado"})
        }
        if(user.password !== password){
            return res.status(401).json({message: "Contraseña incorrecta"})
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        }
        

        return res.status(200).redirect("/home")

    } catch (error) {

        return res
        .status(500)
        .json({error: "Hubo un error", details:error.message})
        
    }
})


sessionRouter.post("/api/sessions/register", async (req,res) => {
    const {first_name,last_name,email,age,password} = req.body

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).json({message: "Todos los campos son requeridos"})
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está en uso" });
        }
    
        const user = await userModel.create({
            first_name : first_name,
            last_name: last_name,
            email: email,
            age: age,
            password: password
        })

        return res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        return res
        .status(500)
        .json({error: "Hubo un error", details: error.message})
        
    }
})

sessionRouter.get("/api/sessions/logout",(req,res) => {
    req.session.destroy(err => {
        if(err) {
            return res.json({status: "Logout error", body: err})
        }
        res.redirect("/")
    })
})

export default sessionRouter