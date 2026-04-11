const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { validateReport, validateAdditionalIssue, validateStatusUpdate } = require('../validators/reportValidator');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.post('/', validateReport, reportController.addReport);
router.put('/:id/status', validateStatusUpdate, reportController.updateStatus);
router.put('/:id/details', reportController.updateDetails);
router.post('/:id/messages', reportController.addMessage);

module.exports = router;
