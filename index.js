const express = require('express');
const cors = require('cors');  
const morgan = require('morgan');
require('dotenv').config();

const contactRouter = require('./api/contacts/contactRouters');

const ContactServer = require('./api/server');

new ContactServer().start();
