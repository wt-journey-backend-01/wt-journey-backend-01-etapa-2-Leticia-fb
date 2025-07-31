const { v4: uuidv4, validate: isUuid } = require('uuid');
const agentesRepository = require('./agentesRepository');

// Importa o ID fixo do agente inicial
const { agenteInicialId } = agentesRepository;

if (!isUuid(agenteInicialId)) {
  throw new Error("⚠️ ID do agente inicial inválido. Verifique o agentesRepository.");
}

const casos = [
  {
    id: uuidv4(),
    titulo: "Roubo no banco",
    descricao: "Roubo ocorrido no centro da cidade",
    status: "aberto",
    agente_id: agenteInicialId
  }
];

function findAll() {
  return casos;
}

function findById(id) {
  return casos.find(caso => caso.id === id);
}

function create(caso) {
  const novo = { id: uuidv4(), ...caso };
  casos.push(novo);
  return novo;
}

function update(id, dados) {
  const index = casos.findIndex(c => c.id === id);
  if (index === -1) return null;
  casos[index] = { id, ...dados };
  return casos[index];
}

function partialUpdate(id, dadosParciais) {
  const caso = casos.find(c => c.id === id);
  if (!caso) return null;
  Object.assign(caso, dadosParciais);
  return caso;
}

function remove(id) {
  const index = casos.findIndex(c => c.id === id);
  if (index === -1) return false;
  casos.splice(index, 1);
  return true;
}

function findByAgenteId(agenteId) {
  return casos.filter(c => c.agente_id === agenteId);
}

function findByStatus(status) {
  return casos.filter(c => c.status === status);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
  findByAgenteId,
  findByStatus
};
