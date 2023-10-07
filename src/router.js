const express = require('express');
const router = express();
const userControll = require('./controller/user-controll')
const manager = require('./controller/manager')
const md = require('./middlewares/autentication')



router.get('/contas', md.verificarAutenticacao, manager.openUsers);

router.post('/contas', md.validarBody(
    {
        nome: '', cpf: '',
        data_nascimento: '', telefone: '',
        email: '', senha: ''
    }),
    userControll.createAcount);


router.put('/contas/:numeroConta/usuario', md.validarBody(
    {
        nome: '', data_nascimento: '',
        telefone: '', senha: ''
    }),
    md.validarIdInParams,
    userControll.atualizarUsuario);


router.delete('/contas/:numeroConta', md.validarIdInParams, userControll.deletarUsuario);


router.post('/transacoes/depositar', md.validarBody(
    { numero_conta: '', valor: '' }),
    md.validarIdInBody, userControll.depositar);


router.post('/transacoes/sacar', md.validarBody(
    { numero_conta: '', valor: '', senha: '' }),
    md.validarIdInBody, userControll.sacar);


router.post('/transacoes/transferir', md.validarBody(
    {
        numero_conta_origem: '', numero_conta_destino: '',
        valor: '', senha: ''
    }),
    userControll.transferir);


router.get('/contas/saldo', md.autenticarUser, userControll.verificarSaldo);


router.get('/contas/extrato', md.autenticarUser, userControll.exibirExtrato);

module.exports = router;