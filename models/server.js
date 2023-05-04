import express from 'express';
import cors from 'cors';
import {router} from '../routes/user.js';
import { dbConnection } from '../database/config.js';

class Server{
    constructor(){
        this.app=express();
        this.port =process.env.PORT;
        this.usuariosPath='/api/usuarios';

        //conectar db
        this.conectaDB();

        //Middlewares
        this.middlewares();
        
        //Rutas Aplicacion
        this.routes();
    }

    async conectaDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        //cors
        this.app.use(cors());
        //parseo body json
        this.app.use(express.json())
    }

    routes(){
       this.app.use(this.usuariosPath, router);
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor iniciado en puerto ${this.port}`);
        });
    }
}

export {Server}