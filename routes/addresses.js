const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../controllers/addresses");

const { protect } = require("../controllers/auth");

const router = express.Router();

router
  .post("/", protect("user"), addAddress)
  .delete("/:addressId", protect("user"), removeAddress)
  .get("/me", protect("user"), getLoggedUserAddresses);

module.exports = router;
