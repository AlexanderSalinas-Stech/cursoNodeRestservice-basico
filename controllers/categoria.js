import { response } from "express";
import { Categoria } from "../models/index.js";

//obtenerCategorias- paginado - total -populate
const obtenerCategorias = async (req=request, res=response) =>{
    const query={estado:true};
    const {limite=5, desde=0}=req.query;
   
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({total,categorias});
    
}

//obtenerCategoria -populate {}
const obtenerCategoria = async (req=request, res=response) =>{
    const {id}=req.params; 
    
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
   

    res.json(categoria);
    // res.json({resp});
    
}


const crearCategoria =async(req,res=response)=>{
    const nombre = req.body.nombre.toUpperCase();
    
    const categoriaDB = await Categoria.findOne({nombre});
    
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    const data ={
        nombre,
        usuario:req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
       categoria
    });
};

//actualizarCategoria
const actualizarCategoria= async (req=request, res=response) =>{
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;  

    data.nombre = data.nombre.toUpperCase();
    data.usuario= req.usuario._id;
    data.updatedAt =Date.now();

    const categoriaDB = await Categoria.findOne({nombre:data.nombre});
    
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id,data, {new:true});

    res.json(categoria);
}

//BorrarCategoria
const BorrarCategoria =async(req=request, res=response)=>{
    const {id}=req.params;
    const categoriaborrada =await Categoria.findByIdAndUpdate(id,{estado:false, updatedAt :Date.now()}, {new:true});
    // console.log(categoriaborrada);

    res.json({msg:"Categoria borrada"});
};

export {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    BorrarCategoria
}