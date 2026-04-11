const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { validateCar } = require('../validators/carValidator');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', carController.getCars);
router.post('/', validateCar, carController.addCar);
router.put('/:id', validateCar, carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;
