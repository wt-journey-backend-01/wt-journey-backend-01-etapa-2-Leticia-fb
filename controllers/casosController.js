const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

// Util para verificar status válido
function isStatusValido(status) {
  return status === 'aberto' || status === 'solucionado';
}

function getAllCasos(req, res) {
  const { agente_id, status, q } = req.query;

  if (agente_id) {
    if (!isUuid(agente_id)) {
      return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
          agente_id: "O campo 'agente_id' deve ser um UUID válido"
        }
      });
    }
    return res.json(casosRepository.findByAgenteId(agente_id));
  }

  if (status) {
    if (!isStatusValido(status)) {
      return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
          status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
        }
      });
    }
    return res.json(casosRepository.findByStatus(status));
  }

  if (q) {
    return res.json(casosRepository.search(q));
  }

  return res.status(200).json(casosRepository.findAll());
}

function getCasoById(req, res) {
  const { id } = req.params;
  const { agente_id } = req.query;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        id: "O campo 'id' deve ser um UUID válido"
      }
    });
  }

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  // Se a query ?agente_id=... estiver presente, retorna o agente do caso
  if (agente_id) {
    if (!isUuid(agente_id)) {
      return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
          agente_id: "O campo 'agente_id' deve ser um UUID válido"
        }
      });
    }

    const agente = agentesRepository.findById(caso.agente_id);
    if (!agente) {
      return res.status(404).json({
        status: 404,
        message: "Agente responsável não encontrado"
      });
    }

    return res.json(agente);
  }

  return res.json(caso);
}

function createCaso(req, res) {
  const { titulo, descricao, status, agente_id } = req.body;

  const errors = {};
  if (!titulo) errors.titulo = "Campo 'titulo' é obrigatório";
  if (!descricao) errors.descricao = "Campo 'descricao' é obrigatório";
  if (!status) {
    errors.status = "Campo 'status' é obrigatório";
  } else if (!isStatusValido(status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }

  if (!agente_id) {
    errors.agente_id = "Campo 'agente_id' é obrigatório";
  } else if (!isUuid(agente_id)) {
    errors.agente_id = "O campo 'agente_id' deve ser um UUID válido";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const novo = casosRepository.create({ titulo, descricao, status, agente_id });
  return res.status(201).json(novo);
}

function updateCaso(req, res) {
  const { id } = req.params;
  const { titulo, descricao, status, agente_id } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        id: "O campo 'id' deve ser um UUID válido"
      }
    });
  }

  const errors = {};
  if (!titulo) errors.titulo = "Campo 'titulo' é obrigatório";
  if (!descricao) errors.descricao = "Campo 'descricao' é obrigatório";
  if (!status || !isStatusValido(status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }
  if (!agente_id || !isUuid(agente_id)) {
    errors.agente_id = "O campo 'agente_id' deve ser um UUID válido";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const atualizado = casosRepository.update(id, { titulo, descricao, status, agente_id });
  if (!atualizado) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  return res.json(atualizado);
}

function patchCaso(req, res) {
  const { id } = req.params;
  const atualizacoes = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        id: "O campo 'id' deve ser um UUID válido"
      }
    });
  }

  if (atualizacoes.status && !isStatusValido(atualizacoes.status)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
      }
    });
  }

  if (atualizacoes.agente_id && !isUuid(atualizacoes.agente_id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        agente_id: "O campo 'agente_id' deve ser um UUID válido"
      }
    });
  }

  const atualizado = casosRepository.partialUpdate(id, atualizacoes);
  if (!atualizado) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  return res.json(atualizado);
}

function deleteCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        id: "O campo 'id' deve ser um UUID válido"
      }
    });
  }

  const sucesso = casosRepository.remove(id);
  if (!sucesso) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  return res.status(204).send();
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso
};
