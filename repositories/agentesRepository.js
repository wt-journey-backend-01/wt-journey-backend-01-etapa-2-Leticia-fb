const { v4: uuidv4 } = require('uuid');

const cargosValidos = ['delegado', 'investigador', 'escrivao', 'perito', 'agente'];

const agentes = [
  {
    id: uuidv4(),
    nome: "Rommel Carneiro",
    dataDeIncorporacao: "1992-10-04",
    cargo: "delegado"
  }
];

function isDataValida(data) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

function isCargoValido(cargo) {
  return cargosValidos.includes(cargo);
}

function findAll() {
  return agentes;
}

function findById(id) {
  return agentes.find(agente => agente.id === id);
}

function create(agente) {
  if (!isDataValida(agente.dataDeIncorporacao)) {
    throw new Error("Data de incorporação inválida. Formato esperado: YYYY-MM-DD");
  }
  if (!isCargoValido(agente.cargo)) {
    throw new Error(`Cargo inválido. Os cargos permitidos são: ${cargosValidos.join(', ')}`);
  }

  const novo = { id: uuidv4(), ...agente };
  agentes.push(novo);
  return novo;
}

function update(id, dados) {
  if (!isDataValida(dados.dataDeIncorporacao)) {
    throw new Error("Data de incorporação inválida. Formato esperado: YYYY-MM-DD");
  }
  if (!isCargoValido(dados.cargo)) {
    throw new Error(`Cargo inválido. Os cargos permitidos são: ${cargosValidos.join(', ')}`);
  }

  const index = agentes.findIndex(a => a.id === id);
  if (index === -1) return null;

  agentes[index] = { id, ...dados };
  return agentes[index];
}

function partialUpdate(id, dadosParciais) {
  const agente = agentes.find(a => a.id === id);
  if (!agente) return null;

  if (dadosParciais.dataDeIncorporacao && !isDataValida(dadosParciais.dataDeIncorporacao)) {
    throw new Error("Data de incorporação inválida. Formato esperado: YYYY-MM-DD");
  }
  if (dadosParciais.cargo && !isCargoValido(dadosParciais.cargo)) {
    throw new Error(`Cargo inválido. Os cargos permitidos são: ${cargosValidos.join(', ')}`);
  }

  Object.assign(agente, dadosParciais);
  return agente;
}

function remove(id) {
  const index = agentes.findIndex(a => a.id === id);
  if (index === -1) return false;
  agentes.splice(index, 1);
  return true;
}

function findByCargo(cargo) {
  return agentes.filter(a => a.cargo === cargo);
}

function sortByData(ordem = "asc") {
  return [...agentes].sort((a, b) => {
    const d1 = new Date(a.dataDeIncorporacao);
    const d2 = new Date(b.dataDeIncorporacao);
    return ordem === "asc" ? d1 - d2 : d2 - d1;
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
  findByCargo,
  sortByData
};
