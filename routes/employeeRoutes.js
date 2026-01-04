const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

router.post('/register', employeeController.registeremployee);
router.post('/login', employeeController.loginemployee);

router.get('/profile', auth,  employeeController.profileemployee);

router.get('/all', auth,  employeeController.getAllEmployees);

router.get('/edit/:id', auth, employeeController.editemployee);
router.put('/update/:id', auth, employeeController.updateemployee);
router.delete('/delete/:id', auth, employeeController.deleteemployee);


module.exports = router;
