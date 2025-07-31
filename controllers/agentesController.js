const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUuid } = require('uuid');
function getAllAgentes(req, res) {
  const { cargo, sort } = req.query;

  // Cópia segura do array original
  let agentes = [...agentesRepository.findAll()];

  // Filtro por cargo
  if (cargo) {
    agentes = agentes.filter(agente => agente.cargo === cargo);
  }

  // Ordenação por dataDeIncorporacao (crescente ou decrescente)
  if (sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao') {
    agentes = agentes.filter(a => isValidDate(a.dataDeIncorporacao)); // remove agentes com datas inválidas

    agentes.sort((a, b) => {
      const dateA = new Date(a.dataDeIncorporacao);
      const dateB = new Date(b.dataDeIncorporacao);

      return sort === 'dataDeIncorporacao'
        ? dateA - dateB // crescente
        : dateB - dateA; // decrescente
    });
  }

  res.status(200).json(agentes);
}

// Função auxiliar para validar datas no formato YYYY-MM-DD
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
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado"
    });
  }

  res.status(200).json(agente);
}

function createAgente(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;

  const errors = {};
  if (!nome) errors.nome = "Campo obrigatório";
  if (!dataDeIncorporacao) errors.dataDeIncorporacao = "Campo obrigatório (YYYY-MM-DD)";
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
