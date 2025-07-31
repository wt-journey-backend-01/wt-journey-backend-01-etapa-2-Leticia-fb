const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { validate: isUuid } = require('uuid');

function getAllCasos(req, res) {
  const { agente_id, status, q } = req.query;
  const errors = {};

  // Validação do agente_id
  if (agente_id) {
    if (!isUuid(agente_id)) {
      errors.agente_id = "ID deve ser um UUID válido";
    } else if (!agentesRepository.findById(agente_id)) {
      errors.agente_id = "Agente não encontrado";
    }
  }

  // Validação do status
  if (status && status !== 'aberto' && status !== 'solucionado') {
    errors.status = "Status deve ser 'aberto' ou 'solucionado'";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
    });
  }

  const resultado = casosRepository.findAllComFiltros({ agente_id, status, q });
  return res.json(resultado);
}

function getCasoById(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
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
  if (!agente_id) {
    errors.agente_id = "Campo obrigatório";
  } else if (!isUuid(agente_id)) {
    errors.agente_id = "ID do agente deve ser UUID válido";
  } else if (!agentesRepository.findById(agente_id)) {
    errors.agente_id = "Agente não encontrado";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors
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

  // Verificação de ID (UUID válido)
  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const casoExistente = casosRepository.findById(id);
  if (!casoExistente) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  // Validação de campos obrigatórios
  const erros = {};
  if (!titulo) erros.titulo = "Campo obrigatório";
  if (!descricao) erros.descricao = "Campo obrigatório";
  if (!status || !["aberto", "solucionado"].includes(status)) {
    erros.status = "Status deve ser 'aberto' ou 'solucionado'";
  }
  if (!agente_id || !isUuid(agente_id)) {
    erros.agente_id = "Agente deve ser um UUID válido";
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: erros
    });
  }

  const atualizado = {
    id, // mantém o ID original
    titulo,
    descricao,
    status,
    agente_id
  };

  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

function patchCaso(req, res) {
  const { id } = req.params;
  const { id: idBody, titulo, descricao, status, agente_id } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado"
    });
  }

  // Proíbe alteração do ID
  if (idBody && idBody !== id) {
    return res.status(400).json({
      status: 400,
      message: "Alteração do ID não é permitida"
    });
  }

  // Verifica se pelo menos um campo foi enviado
  if (titulo === undefined && descricao === undefined && status === undefined && agente_id === undefined) {
    return res.status(400).json({
      status: 400,
      message: "Nenhum campo válido fornecido para atualização"
    });
  }

  const erros = {};

  if (titulo !== undefined && typeof titulo !== 'string') {
    erros.titulo = "Título deve ser uma string";
  }

  if (descricao !== undefined && typeof descricao !== 'string') {
    erros.descricao = "Descrição deve ser uma string";
  }

  if (status !== undefined && status !== 'aberto' && status !== 'solucionado') {
    erros.status = "Status deve ser 'aberto' ou 'solucionado'";
  }

  if (agente_id !== undefined) {
    if (!isUuid(agente_id)) {
      erros.agente_id = "ID do agente deve ser um UUID válido";
    } else if (!agentesRepository.findById(agente_id)) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
      });
    }
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: erros
    });
  }

  const atualizado = {
    ...caso,
    ...(titulo !== undefined && { titulo }),
    ...(descricao !== undefined && { descricao }),
    ...(status !== undefined && { status }),
    ...(agente_id !== undefined && { agente_id }),
  };

  casosRepository.update(id, atualizado);
  res.status(200).json(atualizado);
}

module.exports = {
  patchCaso
};

function deleteCaso(req, res) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      status: 400,
      message: "Parâmetros inválidos",
      errors: { id: "ID deve ser um UUID válido" }
    });
  }

  const success = casosRepository.deleteById(id);
  if (!success) {
    return res.status(404).json({ status: 404, message: "Caso não encontrado" });
  }

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
