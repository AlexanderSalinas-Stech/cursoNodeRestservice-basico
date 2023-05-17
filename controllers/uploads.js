
import { response } from "express";
import { subirArchivos } from "../helpers/index.js";
import {Usuario,Producto} from '../models/index.js';
import path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from 'dotenv';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const cargarArchivo =async(req, res=response)=>{    
    
    try {
        // const nombre=await subirArchivos(req.files,['txt','md'],'textos');
        const nombre=await subirArchivos(req.files,undefined,'images');
        res.json({nombre})
    } catch (msg) {
        res.status(400).json({msg})
    }    
};

const actualizarImagen =async(req,res=response)=>{
    const {id,coleccion}=req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un usuario con el id: '+id});
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un producto con el id: '+id});
            }
        break;
    
        default:
            return res.status(500).json({msg:'coleccion no encontrada'});
    }

    //limpiar imagenes previas
    try {
        if (modelo.img) {
            //borrar imagen previa
            const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
        
    } catch (error) {
        return res.status(500).json({msg:'error limpiando imagen previa'});
    }

     const nombre=await subirArchivos(req.files,undefined,coleccion);
     modelo.img=nombre;

    await modelo.save();
    res.json(modelo);
};

const mostrarArchivo=async (req, res=response)=>{
    const {id,coleccion}=req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un usuario con el id: '+id});
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un producto con el id: '+id});
            }
        break;
    
        default:
            return res.status(500).json({msg:'coleccion no encontrada'});
    }

    //ver imagenes
    try {
        if (modelo.img) {
            
            const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }
        
    } catch (error) {
        return res.status(500).json({msg:'error buscando imagen'});
    }

    const pathImagenDefault=path.join(__dirname,'../assets/no-image.jpg');
    return res.sendFile(pathImagenDefault);
};

const actualizarImagenCloudinary =async(req,res=response)=>{
    const {id,coleccion}=req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un usuario con el id: '+id});
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msg:'no existe un producto con el id: '+id});
            }
        break;
    
        default:
            return res.status(500).json({msg:'coleccion no encontrada'});
    }

    
    try {
        //limpiar imagenes previas
        if (modelo.img && modelo.img.includes('res.cloudinary.com')) {
            //borrar imagen previa
            const nombreArr=modelo.img.split('/');
            const nombre=nombreArr[nombreArr.length-1];
            const [public_id]=nombre.split('.');

            cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath}=req.files.archivo;
        const {secure_url}=await cloudinary.uploader.upload(tempFilePath);

        //  const nombre=await subirArchivos(req.files,undefined,coleccion);
        modelo.img=secure_url;

        await modelo.save();
        res.json(modelo);
        
    } catch (error) {
        return res.status(500).json({msg:'error Cloudinary',error});
    }

    
};

export{
    cargarArchivo,
    actualizarImagen,
    mostrarArchivo,
    actualizarImagenCloudinary
}