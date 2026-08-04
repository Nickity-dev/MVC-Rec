const express = require('express');
const controller = require('../controllers/eventController');
const { requireAuth, requireOrganizer, sanitizeBody } = require('../middlewares/auth');

const router = express.Router();

router.get('/', controller.home);
router.get('/registro', controller.registerPage);
router.post('/registro', sanitizeBody, controller.register);
router.get('/login', controller.loginPage);
router.post('/login', sanitizeBody, controller.login);
router.get('/logout', controller.logout);
router.get('/eventos/novo', requireAuth, requireOrganizer, controller.createEventPage);
router.post('/eventos/novo', requireAuth, requireOrganizer, sanitizeBody, controller.createEvent);
router.get('/eventos/:id/editar', requireAuth, requireOrganizer, controller.editEventPage);
router.post('/eventos/:id/editar', requireAuth, requireOrganizer, sanitizeBody, controller.editEvent);
router.post('/eventos/:id/excluir', requireAuth, requireOrganizer, controller.deleteEvent);
router.get('/eventos/:id', controller.eventDetail);
router.post('/eventos/:id/inscrever', requireAuth, sanitizeBody, controller.subscribe);

module.exports = router;
