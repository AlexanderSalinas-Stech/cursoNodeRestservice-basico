import{ response,request } from "express";
import { Usuario } from "../models/usuario.js";
import * as bcrypt from 'bcrypt';
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";


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

const googleSignIn = async(req=request, res=response)=>{
    const {id_token}=req.body;

    try {
        const {correo,nombre,img} =await googleVerify(id_token)
        
        let usuario = await Usuario.findOne({correo});
        
        //crear usuario si no existe
        if (!usuario) {
            
            const data ={
                nombre,
                correo,
                password:':P',
                img,
                google:true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario esta en bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario Bloqueado"
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
       res.status(400).json({
        error,
        msg: "el token no se pudo verificar"
       });
    }

    
}

export {
    login,googleSignIn
}