const agentesRepository = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

function getAllAgentes(req, res) {
  const { cargo, sort } = req.query;

  let agentes = agentesRepository.findAll();

  if (cargo) {
    agentes = agentes.filter(agente => agente.cargo === cargo);
  }

  if (sort === 'dataDeIncorporacao') {
    agentes.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
  } else if (sort === '-dataDeIncorporacao') {
    agentes.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
  }

  res.status(200).json(agentes);
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
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado"
    });
  }

  res.status(200).json(agente);
}

function createAgente(req, res) {
  const { id, nome, dataDeIncorporacao, cargo } = req.body;

  if (!id || !isUuid(id) || !nome || !dataDeIncorporacao || !cargo) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        id: "UUID obrigatório",
        nome: "Campo obrigatório",
        dataDeIncorporacao: "Campo obrigatório (YYYY-MM-DD)",
        cargo: "Campo obrigatório"
      }
    });
  }

  const novoAgente = { id, nome, dataDeIncorporacao, cargo };
  agentesRepository.create(novoAgente);

  res.status(201).json(novoAgente);
}

function updateAgente(req, res) {
  const { id } = req.params;
  const { nome, dataDeIncorporacao, cargo } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "ID inválido"
    });
  }

  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = { id, nome, dataDeIncorporacao, cargo };
  agentesRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchAgente(req, res) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ status: 400, message: "ID inválido" });
  }

  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = { ...agente, ...req.body };
  agentesRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function deleteAgente(req, res) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ status: 400, message: "ID inválido" });
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
