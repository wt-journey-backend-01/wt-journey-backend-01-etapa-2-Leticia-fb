const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUuid } = require('uuid');

function getAllAgentes(req, res) {
  const { cargo, sort } = req.query;

  let agentes = agentesRepository.findAll();

  // Filtro por cargo
  if (cargo) {
    agentes = agentes.filter(a => a.cargo === cargo);
  }

  // Ordenação por dataDeIncorporacao
  if (sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao') {
    // Separar agentes com datas válidas e inválidas
    const agentesValidos = agentes.filter(a => isValidDate(a.dataDeIncorporacao));
    const agentesInvalidos = agentes.filter(a => !isValidDate(a.dataDeIncorporacao));

    agentesValidos.sort((a, b) => {
      const dateA = new Date(a.dataDeIncorporacao);
      const dateB = new Date(b.dataDeIncorporacao);
      return sort === 'dataDeIncorporacao' ? dateA - dateB : dateB - dateA;
    });

    agentes = [...agentesValidos, ...agentesInvalidos]; // mantém os inválidos no final
  }

  res.status(200).json(agentes);
}


function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function getAgenteById(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const agente = agentesRepository.findById(id);

  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  res.status(200).json(agente);
}

function createAgente(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;

  const errors = {};
  if (!nome) errors.nome = "Campo obrigatório";
  if (!dataDeIncorporacao) {
    errors.dataDeIncorporacao = "Campo obrigatório (YYYY-MM-DD)";
  } else if (!isValidDate(dataDeIncorporacao)) {
    errors.dataDeIncorporacao = "Deve estar no formato YYYY-MM-DD";
  } else if (new Date(dataDeIncorporacao) > new Date()) {
    errors.dataDeIncorporacao = "Data de incorporação não pode ser no futuro";
  }
  if (!cargo) errors.cargo = "Campo obrigatório";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const novoAgente = {
    id: uuidv4(),
    nome,
    dataDeIncorporacao,
    cargo
  };

  agentesRepository.create(novoAgente);

  res.status(201).json(novoAgente);
}

function updateAgente(req, res) {
  const { id } = req.params;
  const { nome, dataDeIncorporacao, cargo } = req.body;

  const errors = {};
  if (!isUuid(id)) errors.id = "ID deve ser um UUID válido";

  if (!nome) errors.nome = "Campo obrigatório";
  if (!dataDeIncorporacao) {
    errors.dataDeIncorporacao = "Campo obrigatório (YYYY-MM-DD)";
  } else if (!isValidDate(dataDeIncorporacao)) {
    errors.dataDeIncorporacao = "Deve estar no formato YYYY-MM-DD";
  } else if (new Date(dataDeIncorporacao) > new Date()) {
    errors.dataDeIncorporacao = "Data de incorporação não pode ser no futuro";
  }
  if (!cargo) errors.cargo = "Campo obrigatório";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = {
    id,
    nome,
    dataDeIncorporacao,
    cargo
  };

  agentesRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchAgente(req, res) {
  const { id } = req.params;
  const { id: _, ...dataAtualizacao } = req.body;

  const errors = {};
  if (!isUuid(id)) errors.id = "ID deve ser um UUID válido";

  if (dataAtualizacao.dataDeIncorporacao) {
    if (!isValidDate(dataAtualizacao.dataDeIncorporacao)) {
      errors.dataDeIncorporacao = "Deve estar no formato YYYY-MM-DD";
    } else if (new Date(dataAtualizacao.dataDeIncorporacao) > new Date()) {
      errors.dataDeIncorporacao = "Data de incorporação não pode ser no futuro";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = { ...agente, ...dataAtualizacao };
  agentesRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function deleteAgente(req, res) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const success = agentesRepository.deleteById(id);
  if (!success) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  res.status(204).send();
}

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente
};
