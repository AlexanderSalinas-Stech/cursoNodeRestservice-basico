import express from 'express';
import cors from 'cors';
import { dbConnection } from '../database/config.js';
import {router} from '../routes/user.js';
import { routerAuth } from '../routes/auth.js';
import { routerCategorias } from '../routes/categorias.js';
import { routerProductos } from '../routes/productos.js';
import { routerBuscar } from '../routes/buscar.js';

class Server{
    constructor(){
        this.app=express();
        this.port =process.env.PORT;

        this.paths ={
            usuarios:'/api/usuarios',
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos'
        }
        

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
        this.app.use(this.paths.usuarios, router);
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.buscar, routerBuscar);
        this.app.use(this.paths.categorias, routerCategorias);
        this.app.use(this.paths.productos, routerProductos);
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor iniciado en puerto ${this.port}`);
        });
    }
}

export {Server}