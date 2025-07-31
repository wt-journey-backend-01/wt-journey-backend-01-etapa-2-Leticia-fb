const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUuid } = require('uuid');

function getAllCasos(req, res) {
  const { agente_id, status, q } = req.query;

  let casos = casosRepository.findAll();

  if (agente_id) {
    casos = casos.filter(c => c.agente_id === agente_id);
  }

  if (status) {
    casos = casos.filter(c => c.status === status);
  }

  if (q) {
    const query = q.toLowerCase();
    casos = casos.filter(c =>
      c.titulo.toLowerCase().includes(query) || c.descricao.toLowerCase().includes(query)
    );
  }

  res.status(200).json(casos);
}

function getCasoById(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({ status: 404, message: "Caso não encontrado" });
  }

  res.status(200).json(caso);
}

function createCaso(req, res) {
  const { titulo, descricao, status, agente_id } = req.body;

  const errors = {};
  if (!titulo) errors.titulo = "Campo obrigatório";
  if (!descricao) errors.descricao = "Campo obrigatório";
  if (!["aberto", "solucionado"].includes(status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }
  if (!agente_id) {
    errors.agente_id = "Campo obrigatório";
  } else if (!isUuid(agente_id)) {
    errors.agente_id = "ID do agente deve ser UUID válido";
  } else if (!agentesRepository.findById(agente_id)) {
    errors.agente_id = "Agente não encontrado";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const novoCaso = {
    id: uuidv4(),
    titulo,
    descricao,
    status,
    agente_id
  };

  casosRepository.create(novoCaso);

  res.status(201).json(novoCaso);
}

function updateCaso(req, res) {
  const { id } = req.params;
  const { titulo, descricao, status, agente_id } = req.body;

  const errors = {};

  if (!isUuid(id)) {
    errors.id = "ID deve ser um UUID válido";
  }

  if (!titulo) errors.titulo = "Campo obrigatório";
  if (!descricao) errors.descricao = "Campo obrigatório";
  if (!["aberto", "solucionado"].includes(status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }
  if (!agente_id) {
    errors.agente_id = "Campo obrigatório";
  } else if (!isUuid(agente_id)) {
    errors.agente_id = "ID do agente deve ser UUID válido";
  } else if (!agentesRepository.findById(agente_id)) {
    errors.agente_id = "Agente não encontrado";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({ status: 404, message: "Caso não encontrado" });
  }

  const atualizado = {
    id,
    titulo,
    descricao,
    status,
    agente_id
  };

  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchCaso(req, res) {
  const { id } = req.params;

  const errors = {};

  if (!isUuid(id)) {
    errors.id = "ID deve ser um UUID válido";
  }

  const { id: _, ...dataAtualizacao } = req.body;

  if (dataAtualizacao.status && !["aberto", "solucionado"].includes(dataAtualizacao.status)) {
    errors.status = "O campo 'status' pode ser somente 'aberto' ou 'solucionado'";
  }

  if (dataAtualizacao.agente_id) {
    if (!isUuid(dataAtualizacao.agente_id)) {
      errors.agente_id = "ID do agente deve ser UUID válido";
    } else if (!agentesRepository.findById(dataAtualizacao.agente_id)) {
      errors.agente_id = "Agente não encontrado";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({ status: 404, message: "Caso não encontrado" });
  }

  const atualizado = { ...caso, ...dataAtualizacao };
  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function deleteCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const success = casosRepository.deleteById(id);
  if (!success) {
    return res.status(404).json({ status: 404, message: "Caso não encontrado" });
  }

  res.status(204).send();
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso
};
