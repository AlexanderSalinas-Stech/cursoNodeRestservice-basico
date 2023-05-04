import mongoose from "mongoose";

const dbConnection = async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser:true,
            useUnifiedTopology:true
       });

       console.log('conectado a DB')
    } catch (error) {
        console.log(error);
        throw error//new Error('Error en conexion a DB')
    }
};

export {dbConnection}