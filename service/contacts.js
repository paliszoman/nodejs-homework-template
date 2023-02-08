const { contact } = require("./../service/schemas/contact");

const listContacts = async () => {
  try {
    const contacts = await contact.find();
    return contacts;
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await contact.findOne({ id: contactId });
    return contacts;
  } catch (err) {
    console.log(err);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await contact.deleteOne({ id: contactId });
    console.log(contacts);
  } catch (err) {
    console.log(err);
  }
};

const addContact = async ({ name, email, phone, favorite }) => {
  try {
    const newContact = await contact.create({
      id: Date.now().toString(),
      name,
      email,
      phone,
      favorite,
    });
    console.log(favorite);
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, { name, email, phone }) => {
  try {
    const updatedContact = await contact.updateOne(
      { id: contactId },
      { name, email, phone }
    );
  } catch (err) {
    console.log(err);
  }
};

const updateStatusContact = async (contactId, { favorite }) => {
  try {
    const updatedContact = await contact.updateOne(
      { id: contactId },
      { favorite }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
