import { Role } from '../models/role.js';
import { Usuario, Categoria, Producto } from '../models/index.js';
import { isValidObjectId } from 'mongoose';

const esRolValido =async(rol='')=>{
    const exsitRol = await Role.findOne({rol});
    if (!exsitRol) {
        throw new Error(`el rol ${rol} no esta registrado en BD`);
    }
}

const emailExiste= async (correo='')=>{
    //verificar si el correo existe
    const existeEmail=await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`el correo ya existe`);
    }
};

const existeUsuarioId= async (id)=>{
    //verificar si el correo existe
    const existeUsuario=await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id} `);
    }
};

const existeCategoriaId= async (id)=>{

    const esMongoID = isValidObjectId(id); // true
 
    if (esMongoID) {
        // id valido
        //verificar si la categoria existe
        const existeCategoria=await Categoria.findById(id);
        if (!existeCategoria) {
            throw new Error(`La Categoria con id: ${id} no existe`);
        }
        
    } else {
        // id no valido
        throw new Error(`No es un id valido`);
    }
    
    
};

const existeProductoId= async (id)=>{

    const esMongoID = isValidObjectId(id); // true
 
    if (esMongoID) {
        // id valido
        //verificar si la producto existe
        const existeProducto=await Producto.findById(id);
        if (!existeProducto) {
            throw new Error(`El producto con id: ${id} no existe`);
        }
        
    } else {
        // id no valido
        throw new Error(`No es un id valido`);
    }
    
    
};

//Validar Colecciones Permitidas
const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
    const incluida=colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion: ${coleccion}, no es una coleccion permitida`)
    }
    return true;
};

export{
    esRolValido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas
}