const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

function isStatusValido(status) {
  return status === 'aberto' || status === 'solucionado';
}

function getAllCasos(req, res) {
  const { agente_id, status, q } = req.query;

  let resultados = casosRepository.findAll();

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
    resultados = resultados.filter(caso => caso.agente_id === agente_id);
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
    resultados = resultados.filter(caso => caso.status === status);
  }

  if (q) {
    resultados = resultados.filter(caso =>
      caso.titulo.toLowerCase().includes(q.toLowerCase()) ||
      caso.descricao.toLowerCase().includes(q.toLowerCase())
    );
  }

  return res.status(200).json(resultados);
}

function getCasoById(req, res) {
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

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  return res.json(caso);
}


function getAgenteDoCaso(req, res) {
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

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
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

  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente responsável não encontrado"
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

  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente responsável não encontrado"
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

  const errors = {};

  if (atualizacoes.status && !isStatusValido(atualizacoes.status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }

  if (atualizacoes.agente_id) {
    if (!isUuid(atualizacoes.agente_id)) {
      errors.agente_id = "O campo 'agente_id' deve ser um UUID válido";
    } else {
      const agente = agentesRepository.findById(atualizacoes.agente_id);
      if (!agente) {
        errors.agente_id = "Agente responsável não encontrado";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
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
  getAgenteDoCaso, 
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso
};
