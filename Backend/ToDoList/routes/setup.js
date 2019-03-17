var express = require('express');
var router = express.Router();
var { Users } = require("../database/schema/index");
var bcryptjs = require('bcryptjs');
router.get('/', async (req, res, next) => {
  let insertUser = {
    username: "phongnn",
    fullname: "Nguyễn Ngọc Phong",
    password: "123"
  }

  const saltRounds = 10;
  bcryptjs.hash(insertUser.password, saltRounds, async (err, hash) => {
        insertUser.password = hash;
        let usersInfo = await Users.create(insertUser)
        console.log(usersInfo)
  });

  return res.send("Done!");

});

module.exports = router;