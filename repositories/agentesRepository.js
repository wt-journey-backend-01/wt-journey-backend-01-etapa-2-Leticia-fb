const agentes = [
  {
    id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
    nome: "Rommel Carneiro",
    dataDeIncorporacao: "1992-10-04",
    cargo: "delegado"
  }
];

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

function findAllComFiltros({ cargo, sort }) {
  let resultado = [...agentes];

  if (cargo) {
    resultado = resultado.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase());
  }

  if (sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao') {
    resultado = resultado.filter(a => isValidDate(a.dataDeIncorporacao));

    resultado.sort((a, b) => {
      const dataA = new Date(a.dataDeIncorporacao);
      const dataB = new Date(b.dataDeIncorporacao);

      return sort === 'dataDeIncorporacao' ? dataA - dataB : dataB - dataA;
    });
  }

  return resultado;
}


function findAll() {
  return agentes;
}

function findById(id) {
  return agentes.find(a => a.id === id);
}

function create(agente) {
  agentes.push(agente);
}

function update(id, novoAgente) {
  const index = agentes.findIndex(a => a.id === id);
  if (index !== -1) {
    agentes[index] = novoAgente;
  }
}

function deleteById(id) {
  const index = agentes.findIndex(a => a.id === id);
  if (index !== -1) {
    agentes.splice(index, 1);
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
