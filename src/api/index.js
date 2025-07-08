const express = require("express");
const router = express.Router();

router.use(require("./analyze"));
router.use(require("./result"));

module.exports = router;
