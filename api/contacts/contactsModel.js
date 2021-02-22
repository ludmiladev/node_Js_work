const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true, default: 'Noname' },
    password: { type: String, required: true, default: 'password' },
    subscription: { type: String, required: true, default: 'free' },
    token: { type: String, default: '' },
  },
  { versionKey: false }
);

class Contact {
  constructor() {
    this.db = mongoose.model('contacts', contactSchema);
  }
  getContacts = async () => {
    return await this.db.find();
  };
  getContactById = async contactId => {
    console.log('start ById:', contactId);
    return await this.db.findById(contactId);
  };
  createContact = async contactData => {
    return await this.db.create(contactData);
  };
  updateContact = async (contactId, contactData) => {
    return await this.db.findByIdAndUpdate(contactId, contactData, {
      new: true,
    });
  };
  deleteContact = async contactId => {
    return await this.db.findByIdAndRemove(contactId);
  };
}

module.exports = new Contact();
