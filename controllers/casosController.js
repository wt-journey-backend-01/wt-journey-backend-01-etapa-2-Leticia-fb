const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

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
  const { id, titulo, descricao, status, agente_id } = req.body;

  if (!id || !isUuid(id) || !titulo || !descricao || !["aberto", "solucionado"].includes(status) || !isUuid(agente_id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: {
        status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
      }
    });
  }

  const novoCaso = { id, titulo, descricao, status, agente_id };
  casosRepository.create(novoCaso);

  res.status(201).json(novoCaso);
}

function updateCaso(req, res) {
  const { id } = req.params;
  const { titulo, descricao, status, agente_id } = req.body;

  if (!isUuid(id)) return res.status(400).json({ status: 400, message: "ID inválido" });

  const caso = casosRepository.findById(id);
  if (!caso) return res.status(404).json({ status: 404, message: "Caso não encontrado" });

  const atualizado = { id, titulo, descricao, status, agente_id };
  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ status: 400, message: "ID inválido" });

  const caso = casosRepository.findById(id);
  if (!caso) return res.status(404).json({ status: 404, message: "Caso não encontrado" });

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
