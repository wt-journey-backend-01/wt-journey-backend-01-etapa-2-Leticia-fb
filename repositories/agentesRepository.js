const { v4: uuidv4 } = require('uuid');

// ID fixo para garantir consistência nos dados iniciais
const agenteInicialId = '7f9e7f6e-8c4a-4bd1-9f26-1e124aa1fc1a';

const cargosValidos = ['delegado', 'investigador', 'escrivao', 'perito', 'agente'];

const agentes = [
  {
    id: agenteInicialId,
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
  const novo = {
    id: agente.id || uuidv4(),
    ...agente
  };

  if (!isDataValida(novo.dataDeIncorporacao)) {
    throw new Error("Data de incorporação inválida. Formato esperado: YYYY-MM-DD");
  }
  if (!isCargoValido(novo.cargo)) {
    throw new Error(`Cargo inválido. Os cargos permitidos são: ${cargosValidos.join(', ')}`);
  }

  agentes.push(novo);
  return novo;
}

function update(id, dados) {
  const index = agentes.findIndex(a => a.id === id);
  if (index === -1) return null;

  const agenteAtual = agentes[index];

  const novoAgente = {
    ...agenteAtual,
    ...dados,
    id // garante que o ID não seja alterado
  };

  if (!isDataValida(novoAgente.dataDeIncorporacao)) {
    throw new Error("Data de incorporação inválida. Formato esperado: YYYY-MM-DD");
  }
  if (!isCargoValido(novoAgente.cargo)) {
    throw new Error(`Cargo inválido. Os cargos permitidos são: ${cargosValidos.join(', ')}`);
  }

  agentes[index] = novoAgente;
  return novoAgente;
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
  sortByData,
  agenteInicialId // exporta o ID fixo para uso no casosRepository
};
