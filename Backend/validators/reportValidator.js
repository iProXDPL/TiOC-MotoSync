const { body, validationResult } = require('express-validator');

const validateReport = [
  body('carId').notEmpty().withMessage('Identyfikator pojazdu jest wymagany'),
  body('description').notEmpty().withMessage('Opis usterki jest wymagany'),
  body('scheduledDate').optional().isISO8601().withMessage('Nieprawidłowa data'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAdditionalIssue = [
  body('description').notEmpty().withMessage('Opis dodatkowej wady jest wymagany'),
  body('estimatedCost').isNumeric().withMessage('Szacowany koszt musi być liczbą'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateStatusUpdate = [
  body('status').isIn(['pending', 'confirmed', 'in_progress', 'awaiting_approval', 'ready', 'completed', 'cancelled']).withMessage('Nieprawidłowy status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateReport, validateAdditionalIssue, validateStatusUpdate };
