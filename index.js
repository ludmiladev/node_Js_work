const contacts = require('./contacts.js');
const argv = require('yargs').argv;
const express = require('express');
const cors = require('cors');  
const morgan = require('morgan');


function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case "list":
            console.table(contacts.listContacts());
            break;

        case "get":
            console.log(contacts.getContactById(id));
            break;

        case "add":
            contacts.addContact(name, email, phone);
            console.log(contacts.listContacts);
            break;

        case "remove":
            contacts.removeContact(id);
            console.log(contacts.listContacts);
            break;

        default:
            console.warn("\x1B[31m Unknown action type!");
    }
}

invokeAction(argv);