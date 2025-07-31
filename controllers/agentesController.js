const agentesRepo = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

function isDataValida(data) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

function getAllAgentes(req, res) {
  const { cargo, sort } = req.query;

  let resultados = agentesRepo.findAll();

  if (cargo) {
    resultados = resultados.filter(a => a.cargo === cargo);
  }

  if (sort === 'dataDeIncorporacao') {
    resultados = resultados.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
  } else if (sort === '-dataDeIncorporacao') {
    resultados = resultados.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
  }

  return res.json(resultados);
}

function getAgenteById(req, res) {
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

  const agente = agentesRepo.findById(id);
  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado"
    });
  }

  return res.json(agente);
}

function createAgente(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;

  const errors = {};
  if (!nome) errors.nome = "Campo 'nome' é obrigatório";
  if (!dataDeIncorporacao) {
    errors.dataDeIncorporacao = "Campo 'dataDeIncorporacao' é obrigatório";
  } else if (!isDataValida(dataDeIncorporacao)) {
    errors.dataDeIncorporacao = "Campo dataDeIncorporacao deve seguir a formatação 'YYYY-MM-DD'";
  }
  if (!cargo) errors.cargo = "Campo 'cargo' é obrigatório";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  try {
    const novo = agentesRepo.create({ nome, dataDeIncorporacao, cargo });
    return res.status(201).json(novo);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }
}

function updateAgente(req, res) {
  const { id } = req.params;
  const { nome, dataDeIncorporacao, cargo } = req.body;

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
  if (!nome) errors.nome = "Campo 'nome' é obrigatório";
  if (!dataDeIncorporacao) {
    errors.dataDeIncorporacao = "Campo 'dataDeIncorporacao' é obrigatório";
  } else if (!isDataValida(dataDeIncorporacao)) {
    errors.dataDeIncorporacao = "Campo dataDeIncorporacao deve seguir a formatação 'YYYY-MM-DD'";
  }
  if (!cargo) errors.cargo = "Campo 'cargo' é obrigatório";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  try {
    const atualizado = agentesRepo.update(id, { nome, dataDeIncorporacao, cargo });
    if (!atualizado) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
      });
    }
    return res.json(atualizado);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }
}

function patchAgente(req, res) {
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

  if (atualizacoes.dataDeIncorporacao && !isDataValida(atualizacoes.dataDeIncorporacao)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        dataDeIncorporacao: "Campo dataDeIncorporacao deve seguir a formatação 'YYYY-MM-DD'"
      }
    });
  }

  try {
    const atualizado = agentesRepo.partialUpdate(id, atualizacoes);
    if (!atualizado) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
      });
    }
    return res.json(atualizado);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }
}

function deleteAgente(req, res) {
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

  const sucesso = agentesRepo.remove(id);
  if (!sucesso) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado"
    });
  }

  return res.status(204).send();
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente
};
