const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const assignmentController = require('../controllers/assignmentController');

router.post('/', auth, assignmentController.createAssignment);
router.get('/', auth, assignmentController.getAssignments);
router.get('/:id', auth, assignmentController.getAssignment);
router.put('/:id', auth, assignmentController.updateAssignment);
router.delete('/:id', auth, assignmentController.deleteAssignment);

module.exports = router;
