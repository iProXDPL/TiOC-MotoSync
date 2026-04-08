const { body, validationResult } = require('express-validator');

const validateCar = [
  body('make').notEmpty().withMessage('Marka jest wymagana'),
  body('model').notEmpty().withMessage('Model jest wymagany'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Nieprawidłowy rok produkcji'),
  body('licensePlate').notEmpty().withMessage('Numer rejestracyjny jest wymagany'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCar };
