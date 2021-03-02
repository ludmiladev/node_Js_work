
const contacts = require('../models/contacts.json');
const { v4: uuid } = require('uuid');
const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, '../models/Contacts.json');

class ContactsController {
    listContacts(req, res) {
        res.json(contacts);
        res.status(200);
    }

    findContactIndex = contactId => {
        const numberId = +contactId;
        return contacts.findIndex(({ id }) => id === numberId);
    };

    getById = (req, res) => {
        const {
            params: { contactId },
        } = req;
        const findContact = this.findContactIndex(contactId);

        res.json(contacts[findContact]);
        res.status(200);
    };

    addContact(req, res) {
        const { body } = req;

        const createContact = {
            id: uuid(),
            ...body,
        };
        contacts.push(createContact);
        fs.writeFile(contactsPath, JSON.stringify(contacts));
        res.json(createContact);
        res.status(201);
    }

    validateRequiredAdd(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        });
        const validationResult = validationRules.validate(req.body);
        if (validationResult.error) {
            return res.status(400).send({ message: 'missing required name field' });
        }
        next();
    }

    removeContact = (req, res) => {
        const { contactId } = req.params;
        const сontactIndex = this.findContactIndex(contactId);
        const deleteContact = contacts.splice(сontactIndex, 1);
        fs.writeFile(contactsPath, JSON.stringify(contacts));
        console.log('deleteContact', deleteContact);

        res.json({ message: 'Contact deleted' });
        res.status(200);
    };

    updateContact = (req, res) => {
        const { contactId } = req.params;
        const сontactIndex = this.findContactIndex(contactId);
        const updateDContact = {
            ...contacts[сontactIndex],
            ...req.body,
        };
        contacts[сontactIndex] = updateDContact;
        fs.writeFile(contactsPath, JSON.stringify(contacts));

        res.json(updateDContact);
        res.status(200);
    };

    validateContactId(req, res, next) {
        const {
            params: { contactId },
        } = req;
        const numberId = +contactId;
        const сontactIndex = contacts.findIndex(({ id }) => id === numberId);
        if (сontactIndex === -1) {
            return res.status(404).send('Not found');
        }
        next();
    }

    validateUpdateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
        }).min(1);

        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {
            return res.status(400).send({ message: 'missing required name field' });
        }

        next();
    }
}

module.exports = new ContactsController();