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
    return res.status(400).json({ status: 400, message: "ID inválido" });
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
  if (!isUuid(agente_id)) {
    errors.agente_id = "ID do agente deve ser UUID válido";
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
      message: "Agente não encontrado para associar o caso"
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

  if (!isUuid(id)) return res.status(400).json({ status: 400, message: "ID inválido" });

  const caso = casosRepository.findById(id);
  if (!caso) return res.status(404).json({ status: 404, message: "Caso não encontrado" });

  if (!isUuid(agente_id)) {
    return res.status(400).json({ status: 400, message: "agente_id inválido" });
  }

  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).json({ status: 404, message: "Agente não encontrado" });
  }

  const atualizado = { id, titulo, descricao, status, agente_id };
  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ status: 400, message: "ID inválido" });

  const caso = casosRepository.findById(id);
  if (!caso) return res.status(404).json({ status: 404, message: "Caso não encontrado" });

  // Valida o agente_id, se fornecido
  if (req.body.agente_id) {
    if (!isUuid(req.body.agente_id)) {
      return res.status(400).json({ status: 400, message: "agente_id inválido" });
    }

    const agente = agentesRepository.findById(req.body.agente_id);
    if (!agente) {
      return res.status(404).json({ status: 404, message: "Agente não encontrado" });
    }
  }

  const atualizado = { ...caso, ...req.body };
  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function deleteCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ status: 400, message: "ID inválido" });

  const success = casosRepository.deleteById(id);
  if (!success) return res.status(404).json({ status: 404, message: "Caso não encontrado" });

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
