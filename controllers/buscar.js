import { response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import { Categoria, Producto, Usuario } from "../models/index.js";

const coleccionesPermitidas=[
    'usuarios',
    'prodcate',
    'categorias',
    'productos'
];

const buscarUsuario = async(termino='',res=response)=>{
    const esMongoID=isValidObjectId(termino);

    if (esMongoID) {
        const usuario=await Usuario.findById(termino);
        return res.json({
            results:(usuario)?[usuario]:[]
        });
    }

    const regex =new RegExp(termino,'i');
    const usuarios=await Usuario.find({
        $or:[
            {nombre:regex},
            {correo:regex},
        ],
        $and:[{estado:true}]

    });
    res.json({
        results:(usuarios)?usuarios:[]
    });
}

const buscarCategoria = async(termino='',res=response)=>{
    const esMongoID=isValidObjectId(termino);

    if (esMongoID) {
        const categoria=await Categoria.findById(termino)
            .populate('usuario','nombre')
            .populate('categoria','nombre');
        return res.json({
            results:(categoria)?[categoria]:[]
        });
    }

    const regex =new RegExp(termino,'i');
    const categorias=await Categoria.find({nombre:regex,estado:true}).populate('usuario','nombre');
    res.json({
        results:(categorias)?categorias:[]
    });
}

const buscarProducto = async(termino='',res=response)=>{
    const esMongoID=isValidObjectId(termino);

    if (esMongoID) {
        const producto=await Producto.findById(termino)
            .populate('usuario','nombre')
            .populate('categoria','nombre');
        return res.json({
            results:(producto)?[producto]:[]
        });
    }

    const regex =new RegExp(termino,'i');
    const productos=await Producto.find({nombre:regex,estado:true})
        .populate('usuario','nombre')
        .populate('categoria','nombre');

    res.json({
        results:(productos)?productos:[]
    });
}

const buscarProductoCategoria = async(termino='',res=response)=>{
    const esMongoID=isValidObjectId(termino);

    if (esMongoID) {
        const producto=await Producto.find({categoria:termino})
            .populate('usuario','nombre')
            .populate('categoria','nombre');
        return res.json({
            results:(producto)?[producto]:[]
        });
    }

    const regex =new RegExp(termino,'i');
    const categorias = await Categoria.find({nombre:regex,estado:true});

    if ( !categorias.length ) {
        return res.status(400).json({
            msg: `No hay resultados de categorias para el termino: ${termino}`
        })
    }
   
    const query2 = {
        $or: [ ...categorias.map ( c => { return { categoria: c._id } } ) ],
        $and: [ { estado: true }]
    }
 
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query2),
        Producto.find(query2).
        populate('categoria', 'nombre')
 
    ])
 
    res.json({
        total,
        results: productos
    })
}

const buscar =async(req, res=response)=>{

    const {coleccion, termino}=req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino,res)
        break;
        
        case 'categorias':
            buscarCategoria(termino,res)
        break;
        case 'productos':
            buscarProducto(termino,res)
        break;
        case 'prodcate':
            buscarProductoCategoria(termino,res)
        break;
    
        default:
            res.status(500).json({
                msg:'Error en la busqueda'
            })
        break;
    }
};

export{
    buscar
}