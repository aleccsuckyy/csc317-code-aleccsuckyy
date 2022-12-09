var express = require('express');
var router = express.Router();
const db = require('../config/db');

const apiRoutes = require('./api/');
const homeRoutes = require('./home-routes');


router.use('/', homeRoutes);
router.use('/api', apiRoutes);


module.exports = router;
