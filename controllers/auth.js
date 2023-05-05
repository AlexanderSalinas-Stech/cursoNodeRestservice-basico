import{ response,request } from "express";
import { Usuario } from "../models/usuario.js";
import * as bcrypt from 'bcrypt';
import { generarJWT } from "../helpers/generar-jwt.js";


const login = async(req=request, res=response)=>{

    const {correo,password}=req.body;

    try {
        // verificar existe correo
        const usuario= await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: "Usuario / Password Erroneos"
            });
        }
        //verificar si usuario activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: "Usuario / Password Erroneos - estado"
            });
        }
        //verificar password
        const validarPass = bcrypt.compareSync(password,usuario.password)
        if(!validarPass){
            return res.status(400).json({
                msg: "Usuario / Password Erroneos - pass"
            });
        }

        //generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token  
        })
    } catch (error) {
        console.log(`error: `, error);
        res.status(500).json({
            msg:"Hable con el Administrador"   
        })
    }
    
};

export {
    login
}