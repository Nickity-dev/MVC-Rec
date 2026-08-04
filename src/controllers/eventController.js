const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel');
const subscriptionModel = require('../models/subscriptionModel');

class EventController {
  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async home(req, res) {
    try {
      const events = await eventModel.getAllEvents();
      res.render('home', { title: 'EventHub', events, user: req.session.user || null, errorMessage: null });
    } catch (error) {
      console.error(error);
      res.render('home', {
        title: 'EventHub',
        events: [],
        user: req.session.user || null,
        errorMessage: 'Não foi possível conectar ao banco de dados. Configure o MySQL e importe o schema.sql.'
      });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async registerPage(req, res) {
    try {
      res.render('register', { title: 'Criar conta', user: req.session.user || null, error: null });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível carregar a página de cadastro.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async register(req, res) {
    try {
      const { nome, email, senha, tipo } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).render('register', { title: 'Criar conta', error: 'Preencha todos os campos.', user: req.session.user || null });
      }

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).render('register', { title: 'Criar conta', error: 'E-mail já cadastrado.', user: req.session.user || null });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      await userModel.createUser({ nome, email, senha: hashedPassword, tipo: tipo || 'participante' });
      res.redirect('/login');
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível concluir o cadastro.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async loginPage(req, res) {
    try {
      res.render('login', { title: 'Entrar', user: req.session.user || null, error: null });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível carregar a página de login.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).render('login', { title: 'Entrar', error: 'Credenciais inválidas.', user: req.session.user || null });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).render('login', { title: 'Entrar', error: 'Credenciais inválidas.', user: req.session.user || null });
      }

      req.session.user = { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo };
      res.redirect('/');
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível autenticar o usuário.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async logout(req, res) {
    try {
      req.session.destroy(() => {
        res.redirect('/');
      });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível encerrar a sessão.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async createEventPage(req, res) {
    try {
      res.render('event-form', { title: 'Novo evento', event: null, user: req.session.user || null, error: null });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível carregar o formulário.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async createEvent(req, res) {
    try {
      const { titulo, descricao, data_inicio, local, capacidade } = req.body;
      if (!titulo || !descricao || !data_inicio || !local || !capacidade) {
        return res.status(400).render('event-form', { title: 'Novo evento', event: null, error: 'Preencha todos os campos.', user: req.session.user || null });
      }

      await eventModel.createEvent({
        titulo,
        descricao,
        data_inicio,
        local,
        capacidade,
        organizador_id: req.session.user.id
      });
      res.redirect('/');
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível criar o evento.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async editEventPage(req, res) {
    try {
      const event = await eventModel.getEventById(req.params.id);
      if (!event) {
        return res.status(404).render('error', { title: 'Evento não encontrado', message: 'O evento solicitado não existe.', user: req.session.user || null });
      }
      res.render('event-form', { title: 'Editar evento', event, user: req.session.user || null, error: null });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível carregar o evento.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async editEvent(req, res) {
    try {
      const { titulo, descricao, data_inicio, local, capacidade } = req.body;
      await eventModel.updateEvent(req.params.id, { titulo, descricao, data_inicio, local, capacidade });
      res.redirect('/');
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível atualizar o evento.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async deleteEvent(req, res) {
    try {
      await eventModel.deleteEvent(req.params.id);
      res.redirect('/');
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível excluir o evento.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async eventDetail(req, res) {
    try {
      const event = await eventModel.getEventById(req.params.id);
      if (!event) {
        return res.status(404).render('error', { title: 'Evento não encontrado', message: 'O evento solicitado não existe.', user: req.session.user || null });
      }
      const subscriptions = await subscriptionModel.getSubscriptionsByEvent(req.params.id);
      res.render('event-detail', { title: 'Detalhes do evento', event, subscriptions, user: req.session.user || null });
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível carregar os detalhes do evento.', user: req.session.user || null });
    }
  }

  /**
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async subscribe(req, res) {
    try {
      const eventId = req.params.id;
      const userId = req.session.user.id;
      const existing = await subscriptionModel.findSubscription(eventId, userId);
      if (existing) {
        return res.redirect(`/eventos/${eventId}`);
      }

      await subscriptionModel.createSubscription(eventId, userId);
      res.redirect(`/eventos/${eventId}`);
    } catch (error) {
      res.status(500).render('error', { title: 'Erro', message: 'Não foi possível realizar a inscrição.', user: req.session.user || null });
    }
  }
}

module.exports = new EventController();
