function sanitizeBody(req, res, next) {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim().replace(/<[^>]*>/g, '');
      }
    });
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireOrganizer(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== 'organizador') {
    return res.status(403).render('error', {
      title: 'Acesso negado',
      message: 'Esta área é exclusiva para organizadores.',
      user: req.session.user || null
    });
  }
  next();
}

module.exports = { sanitizeBody, requireAuth, requireOrganizer };
