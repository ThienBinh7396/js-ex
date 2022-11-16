const express = require("express");
const router = express.Router();

const { faker } = require("@faker-js/faker");

/* GET users listing. */
router.get("/", function (req, res, next) {
  const resultData = [];

  const resultDataLength = req.query.total || 500;

  for (let index = 0; index < resultDataLength; index++) {
    const id = faker.datatype.uuid();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    resultData.push({
      id,
      name: firstName + " " + lastName,
    });
  }
  res.json({ data: resultData, total: resultDataLength });
});

module.exports = router;
