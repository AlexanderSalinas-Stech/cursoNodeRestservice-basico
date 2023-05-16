import { Schema, model } from "mongoose";

const CategoriaSchema=Schema({
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
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date
    }

});

CategoriaSchema.methods.toJSON=function() {
    
    const {_id, __v, estado, ...data} =this.toObject();

    data.uid=_id;
    if (data.usuario._id){
        data.usuario.uid = data.usuario._id
        delete data.usuario._id
    }

    return data;
}

export const Categoria=model('Categoria',CategoriaSchema);