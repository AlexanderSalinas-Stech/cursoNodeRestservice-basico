import{ response,request } from "express";
import  {Usuario} from '../models/usuario.js';
import * as bcrypt from 'bcrypt';


const usuariosGet = async (req=request, res=response) =>{
    // const {q, nombre= 'no name',page=1,limit=10} =req.query;
    const query={estado:true};
    const {limite=5, desde=0}=req.query;
    // const usuarios = await Usuario.find(query)
    //     .limit(Number(limite))
    //     .skip(Number(desde));
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({total,usuarios});
    // res.json({resp});
    
}

const usuariosPut= async (req=request, res=response) =>{
    const {id}=req.params;
    const {_id,rol,password, correo, google, ...resto}=req.body;

    if (password) {
        //encryptar contraseña
        const salt = bcrypt.genSaltSync();
        resto.password=bcrypt.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json(usuario);
}

const usuariosPost= async (req=request, res=response) =>{
    const {nombre,correo,password,rol} =req.body;
    const usuario =new Usuario({nombre,correo,password,rol});
    
    //encryptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password=bcrypt.hashSync(password,salt);
    //guardar en db
    await usuario.save();
    res.json(usuario);
}

const usuariosDelete= async (req=request, res=response) =>{
    const {id}=req.params;
    console.log(req)
    //Borrado Fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Cambio estado
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});
    const usuarioAutenticado=req.usuario;
    

    res.json({msg:'Usuario Borrado',usuario,usuarioAutenticado})
}

export {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}