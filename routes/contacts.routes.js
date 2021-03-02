
const { Router } = require('express');

const ContactsController = require('../controllers/contacts.controllers.js');

const router = Router();

router.get('/', ContactsController.listContacts);
router.get(
  '/:contactId',
  ContactsController.validateContactId,
  ContactsController.getById,
);
router.post(
  '/',
  ContactsController.validateRequiredAdd,
  ContactsController.addContact,
);
router.delete(
  '/:contactId',
  ContactsController.validateContactId,
  ContactsController.removeContact,
);
router.patch(
  '/:contactId',
  ContactsController.validateContactId,
  ContactsController.validateUpdateContact,
  ContactsController.updateContact,
);

module.exports = router;