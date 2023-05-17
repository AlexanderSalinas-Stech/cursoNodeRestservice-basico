import { Schema, model } from "mongoose";

const ProductoSchema=Schema({
    nombre:{
        type: String,
        required:[true,'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuarios',
        required:true
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{
        type:String,
    },
    disponible:{
        type:Boolean,
        default:true
    },
    img:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date
    }

});

ProductoSchema.methods.toJSON=function() {
    
    const {_id, __v, estado, ...data} =this.toObject();

    data.uid=_id;
    if (data.usuario._id){
        data.usuario.uid = data.usuario._id
        delete data.usuario._id
    }
    if (data.categoria._id){
        data.categoria.uid = data.categoria._id
        delete data.categoria._id
    }

    return data;
}

export const Producto=model('Producto',ProductoSchema);