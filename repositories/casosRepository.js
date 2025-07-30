const { v4: uuidv4 } = require('uuid');
const agentesRepository = require('./agentesRepository');

const agentes = agentesRepository.findAll();

let agenteInicialId = null;
if (agentes.length > 0) {
  agenteInicialId = agentes[0].id;
} else {
  // Garante que sempre haja um ID válido, mas idealmente isso nunca deveria acontecer
  agenteInicialId = uuidv4();
  console.warn("⚠️ Nenhum agente encontrado ao criar caso inicial. Usando ID fictício.");
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
