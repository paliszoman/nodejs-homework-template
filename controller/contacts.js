const service = require("../service/contacts.js");

const {
  postValidator,
  putValidator,
  patchValidator,
} = require("../utils/validationContacts");

const getContacts = async (req, res, next) => {
  const contacts = await service.listContacts();
  res.status(200).json(contacts);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await service.getContactById(contactId);
  if (contact) {
    return res.status(200).send(contact);
  }
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const reqBodyValidate = postValidator.validate(req.body);
  if (reqBodyValidate.error) {
    return res.status(406).json({ message: reqBodyValidate.error.details });
  }
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }
  await service.addContact(req.body);
  res.status(201).json({ message: "contact added" });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contactToRemove = await service.getContactById(contactId);
  if (contactToRemove) {
    await removeContact(contactId),
      res.status(200).json({ message: "contact deleted" });
  }
  if (!contactToRemove) {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const reqBodyValidate = putValidator.validate(req.body);
  if (reqBodyValidate.error) {
    return res.status(406).json({ message: reqBodyValidate.error.details });
  }
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const savedContact = await service.updateContact(contactId, req.body);
  if (contactId)
    res.status(200).json({ updated: await service.getContactById(contactId) });
  if (!contactId) res.status(404).json({ message: "Not found" });
};

const changeFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const updatedContact = await getContactById(contactId);
  const reqBodyValidate = patchValidator.validate(req.body);
  if (reqBodyValidate.error) {
    return res.status(406).json({ message: reqBodyValidate.error.details });
  }
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const savedContact = await updateStatusContact(contactId, req.body);

  if (favorite) {
    if (updatedContact)
      return res.status(200).json({ updated: await getContactById(contactId) });
    if (updatedContact === null)
      return res.status(404).json({ message: "id not found" });
  }
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  changeFavorite,
};
