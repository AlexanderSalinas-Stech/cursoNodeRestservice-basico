import { response } from "express";
import { Producto, Categoria } from "../models/index.js";

//obtenerProductos- paginado - total -populate
const obtenerProductos = async (req=request, res=response) =>{
    const query={estado:true};
    const {limite=5, desde=0}=req.query;
   
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .populate('categoria', 'nombre')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({total,productos});
    
}

//obtenerProducto -populate {}
const obtenerProducto = async (req=request, res=response) =>{
    const {id}=req.params; 
    
    const producto = await Producto.findById(id)
        .populate('usuario','nombre')
        .populate('categoria', 'nombre');
   

    res.json(producto);    
}


const crearProducto =async(req,res=response)=>{
    
    const {estado,usuario, ...body} =req.body;
    
    const productoDB = await Producto.findOne({nombre:body.nombre.toUpperCase()});
    
    if(productoDB){
        return res.status(400).json({
            msg: `La producto ${productoDB.nombre} ya existe`
        });
    }

    const data ={
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario:req.usuario._id,
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
       producto
    });
};

// actualizarProducto
const actualizarProducto= async (req=request, res=response) =>{
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;  

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario= req.usuario._id;
    data.updatedAt =Date.now();

    const productoDB = await Producto.findOne({nombre:data.nombre});
    
    if(productoDB){
        return res.status(400).json({
            msg: `La categoria ${productoDB.nombre} ya existe`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id,data, {new:true});

    res.json(producto);
}

//BorrarProducto
const BorrarProducto =async(req=request, res=response)=>{
    const {id}=req.params;
    const productoborrado =await Producto.findByIdAndUpdate(id,{estado:false, updatedAt :Date.now()}, {new:true});
    // console.log(productoborrado);

    res.json({msg:"Producto borrado"});
};

export {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    BorrarProducto
}