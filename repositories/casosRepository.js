const casos = [
  {
    id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
    titulo: "Homicídio",
    descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União",
    status: "aberto",
    agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
  }
];


function findAllComFiltros({ agente_id, status, q }) {
  let resultado = [...casos];

  if (agente_id) {
    resultado = resultado.filter(c => c.agente_id === agente_id);
  }

  if (status) {
    resultado = resultado.filter(c => c.status === status);
  }

  if (q) {
    const termo = q.toLowerCase();
    resultado = resultado.filter(c =>
      c.titulo.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo)
    );
  }

  return resultado;
}

function findAll() {
  return casos;
}

function findById(id) {
  return casos.find(c => c.id === id);
}

function create(caso) {
  casos.push(caso);
}

function update(id, novoCaso) {
  const index = casos.findIndex(c => c.id === id);
  if (index !== -1) {
    casos[index] = novoCaso;
  }
}

function deleteById(id) {
  const index = casos.findIndex(c => c.id === id);
  if (index !== -1) {
    casos.splice(index, 1);
    return true;
  }
  return false;
}

module.exports = {
  findAll,
  findAllComFiltros,
  findById,
  create,
  update,
  deleteById
};
