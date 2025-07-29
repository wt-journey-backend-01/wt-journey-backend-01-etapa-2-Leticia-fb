const { v4: uuidv4 } = require('uuid');

const casos = [
  {
    id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
    titulo: "Homicídio em União",
    descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União.",
    status: "aberto",
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
  },
  {
    id: "a8c5e5c3-f1fc-4c2d-994e-e8db27bc3dc3",
    titulo: "Furto na padaria central",
    descricao: "Ocorrência de furto no dia 03/03/2020 com imagens de segurança.",
    status: "solucionado",
    agente_id: "876aa470-5154-4e84-9084-e5fc10caa4aa"
  }
];

// Listar todos os casos
function findAll() {
  return casos;
}

// Buscar por ID
function findById(id) {
  return casos.find(c => c.id === id);
}

// Criar novo caso
function create(data) {
  const novo = {
    id: uuidv4(),
    ...data
  };
  casos.push(novo);
  return novo;
}

// Atualizar por completo
function update(id, data) {
  const index = casos.findIndex(c => c.id === id);
  if (index === -1) return null;

  casos[index] = { id, ...data };
  return casos[index];
}

// Atualização parcial
function partialUpdate(id, dataParcial) {
  const caso = casos.find(c => c.id === id);
  if (!caso) return null;

  Object.assign(caso, dataParcial);
  return caso;
}

// Deletar
function remove(id) {
  const index = casos.findIndex(c => c.id === id);
  if (index === -1) return false;

  casos.splice(index, 1);
  return true;
}

// Buscar todos os casos de um agente
function findByAgenteId(agenteId) {
  return casos.filter(c => c.agente_id === agenteId);
}

// Filtrar por status
function findByStatus(status) {
  return casos.filter(c => c.status === status);
}

// Pesquisa full-text (no título ou descrição)
function search(termo) {
  const lower = termo.toLowerCase();
  return casos.filter(c =>
    c.titulo.toLowerCase().includes(lower) ||
    c.descricao.toLowerCase().includes(lower)
  );
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
  findByAgenteId,
  findByStatus,
  search
};
