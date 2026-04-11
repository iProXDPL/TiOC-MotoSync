const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { validateReport, validateAdditionalIssue, validateStatusUpdate } = require('../validators/reportValidator');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', reportController.getReports);
router.post('/', validateReport, reportController.addReport);
router.put('/:id/status', validateStatusUpdate, reportController.updateStatus);
router.post('/:id/issues', validateAdditionalIssue, reportController.addAdditionalIssue);
router.put('/:id/issues/:issueId/respond', reportController.respondToIssue);

module.exports = router;
