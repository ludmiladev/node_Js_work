const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const contactsRouter = require('./routes/contacts.routes');

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
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: '*' }));
    this.server.use(morgan('combined'));
  }

  initRoutes() {
    this.server.use('/contacts', contactsRouter);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log('server is started in:', PORT);
    });
  }
}

const server = new Server();
server.start();