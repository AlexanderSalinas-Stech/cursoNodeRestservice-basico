import { request,response } from "express";
import  jwt  from "jsonwebtoken";
import { Usuario } from "../models/usuario.js";

const validarJWT=async (req=request, res=response, next)=>{
    const token=req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg:'Usuario no Autenticado'
        });
    }

    try {
        const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        //leer el usuario
        const usuario= await Usuario.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg:'Token no Valido - Usuario no existe'
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Token no Valido - Usuario desactivado'
            });
        }
        req.usuario= usuario;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg:'Token no Valido'
        });
    }
   
}

export{
    validarJWT
}