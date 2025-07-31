const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUuid } = require('uuid');

function getAllAgentes(req, res) {
  const { cargo, sort } = req.query;

  const agentes = agentesRepository.findAllComFiltros({ cargo, sort });

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

  const agenteExistente = agentesRepository.findById(id);
  if (!agenteExistente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = { id, nome, dataDeIncorporacao, cargo };
  agentesRepository.update(id, atualizado);

  res.status(200).json(atualizado);
}


function patchAgente(req, res) {
  const { id } = req.params;
  const { id: idBody, nome, dataDeIncorporacao, cargo } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado"
    });
  }

  // Impede alteração de ID
  if (idBody && idBody !== id) {
    return res.status(400).json({
      status: 400,
      message: "Alteração do ID não é permitida"
    });
  }

  // Verifica se pelo menos um campo válido foi enviado
  if (nome === undefined && dataDeIncorporacao === undefined && cargo === undefined) {
    return res.status(400).json({
      status: 400,
      message: "Nenhum campo válido fornecido para atualização"
    });
  }

  const erros = {};

  if (dataDeIncorporacao !== undefined && !isValidDate(dataDeIncorporacao)) {
    erros.dataDeIncorporacao = "Data inválida";
  }

  if (nome !== undefined && typeof nome !== 'string') {
    erros.nome = "Nome deve ser uma string";
  }

  if (cargo !== undefined && typeof cargo !== 'string') {
    erros.cargo = "Cargo deve ser uma string";
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: erros
    });
  }

  // Atualiza apenas os campos fornecidos
  const atualizado = {
    ...agente,
    ...(nome !== undefined && { nome }),
    ...(dataDeIncorporacao !== undefined && { dataDeIncorporacao }),
    ...(cargo !== undefined && { cargo })
  };

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
