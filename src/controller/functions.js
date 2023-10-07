const { contas, saques, depositos, transferencias } = require('../database');
const fs = require('fs/promises');

function verificarCpf(id, cpf) {

    const outrasContas = contas.filter(conta => conta.numero !== id);

    if (outrasContas.some(conta => conta.usuario.cpf === cpf)) {
        return true;
    }
    return false;
}


function verificarEmail(id, email) {

    const outrasContas = contas.filter(conta => conta.numero !== id);

    if (outrasContas.some(conta => conta.usuario.email === email)) {
        return true;
    }
    return false;
}


function indexId(id) {
    return contas.findIndex(conta => conta.numero === id)
}

function verificarId(id) {
    if (contas.some(conta => conta.numero === id)) {
        return true
    }
    return false
}

function acharSenha(senha) {
    if (contas.some(conta => conta.usuario.senha === senha)) {
        return true
    }
    return false
}

function filtro(id, array) {
    const resultado = array.filter(conta => conta.numero_conta === id);
    return resultado;
}




module.exports = {
    verificarCpf,
    verificarEmail,
    verificarId,
    indexId,
    acharSenha,
    filtro,



}




