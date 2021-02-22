onst express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const contactRouter = require('./contacts/contactRouters');

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, 'access.log'),
      { flags: 'a' }
    );
    this.server.use(morgan('combined', { stream: accessLogStream }));

    this.server.use(express.json());
    this.server.use(cors({ origin: 'http://localhost:3000' }));
  }
  initRoutes() {
    this.server.use('/contacts', contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`start listening on port ${process.env.PORT}`);
    });
  }
};
