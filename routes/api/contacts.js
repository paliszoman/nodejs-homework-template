const express = require("express");

const controller = require("./../../controller/contacts");

const router = express.Router();

router.get("/", controller.getContacts);

router.get("/:contactId", controller.getContactById);

router.post("/", controller.addContact);

router.delete("/:contactId", controller.deleteContact);

router.put("/:contactId", controller.updateContact);

router.patch("/:contactId/favorite", controller.changeFavorite);

module.exports = router;
