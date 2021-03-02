const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./routes/contacts.routes');

dotenv.config();

const MONGO_URI = process.env.DB_CLOUD;

const PORT = process.env.port || 8080;

class Server {
    constructor() {
        this.server = null;
    }
    start() {
        this.server = express();
        this.initMiddlewares();
        this.initRoutes();
        this.listen();
        this.connectToDb();
    }

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(cors({ origin: '*' }));
        this.server.use(morgan('combined'));
    }

    initRoutes() {
        this.server.use('/contacts', contactsRouter);
    }

    async connectToDb() {
        try {
            if (
                await mongoose.connect(MONGO_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                })
            ) {
                console.log('Database connection successful');
            }
        } catch (error) {
            console.log(err.message);
            process.exit(1);
        }
    }

    listen() {
        this.server.listen(PORT, () => {
            console.log('server is started in:', PORT);
        });
    }
}

const server = new Server();
server.start();