let { contas, depositos, saques, transferencias, serial } = require('../database');
const functions = require('./functions');
const date = require('date-fns');

async function createAcount(req, res) {
    const body = req.body

    const buscarCpf = contas.some(conta => conta.usuario.cpf === body.cpf);
    const vefificarEmail = contas.some(conta => conta.usuario.email === body.email);

    if (buscarCpf) {
        return res.status(400).json({ mensagem: 'Este cpf já está cadastrado' })
    }

    if (vefificarEmail) {
        return res.status(400).json({ mensagem: 'Este email já está cadastrado!' })
    }


    const numero = serial += 1

    contas.push(
        {
            numero,
            saldo: 0,
            usuario: {
                nome: body.nome.trim(),
                cpf: body.cpf.trim(),
                data_nascimento: body.data_nascimento,
                telefone: body.telefone,
                email: body.email.trim(),
                senha: body.senha,
            }
        });
    return res.status(201).json();

}

async function atualizarUsuario(req, res) {
    const { numeroConta } = req.params
    const body = req.body
    const id = Number(numeroConta)
    const idIndex = functions.indexId(id);

    if (body.cpf !== contas[idIndex].usuario.cpf){
        return res.status(400).json({mensagem: 'Para mudar o seu CPF, entre em contato com o suporte'})
    }

    if (functions.verificarCpf(id, body.cpf)) {
        return res.status(400).json({ mensagem: 'CPF já está cadastrado em uma outra conta!' });
    }


    if (functions.verificarEmail(id, body.email)) {
        return res.status(400).json({ mensagem: 'O email informado já existe' });
    }

    if (body.email === "") {
        return res.status(400).json({ mensagem: 'Você não pode apagar o email sem substitui-lo por um email válido' })
    }

    contas[idIndex].usuario = {
        ...contas[idIndex].usuario,
        ...body
    };

    return res.status(204).json();
}



function deletarUsuario(req, res) {
    const { numeroConta } = req.params
    const id = Number(numeroConta);

    const idIndex = functions.indexId(id)

    if ([idIndex].saldo === 0) {
        res.status(403).json({ mensagem: 'A conta só pode ser removida se o saldo for zero' })
    }

    contas.splice(idIndex, 1);

    return res.status(204).json();

}

function depositar(req, res) {
    const { numero_conta, valor } = req.body;
    const id = Number(numero_conta);
    const valorInNumber = Number(valor)
    const idIndex = functions.indexId(id)

    if (valorInNumber <= 0) {
        return res.status(403).json({ mensagem: 'Valor Minimo de depósito inválido!' })
    }

    contas[idIndex].saldo += valorInNumber;

    const newDate = date.format((new Date()), 'yyyy-MM-dd HH:mm:ss')

    depositos.push({
        data: newDate,
        numero_conta: id,
        valor
    })

    return res.status(200).json()
}



function sacar(req, res) {
    const { numero_conta, valor, senha } = req.body
    const saque = Number(valor)
    const conta = functions.indexId(Number(numero_conta));

    if (!functions.acharSenha(senha)) {
        return res.status(400).json({ mensagem: 'Senha inválida!' })
    }

    if (contas[conta].saldo < saque) {
        return res.status(200).json({ mensagem: 'Valor de saque não disponivel' })
    }


    contas[conta].saldo -= saque

    const newDate = date.format((new Date()), 'yyyy-MM-dd HH:mm:ss')


    saques.push({
        data: newDate,
        numero_conta: Number(numero_conta),
        valor: saque
    })


    return res.status(200).json();


}

function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    let origem = Number(numero_conta_origem);
    let destino = Number(numero_conta_destino);

    const idOrigem = functions.indexId(origem);
    const idDestino = functions.indexId(destino);

    const contaOrigem = contas[idOrigem];
    const contaDestino = contas[idDestino];

    if (!functions.verificarId(origem)) {
        return res.status(404).json({ mensagem: 'Conta de origem inexistente!' });
    }

    if (!functions.verificarId(destino)) {
        return res.status(404).json({ mensagem: 'Conta de destino inexistente!' });
    }

    const senhaOrigem = contaOrigem.usuario.senha;

    if (senha !== senhaOrigem) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    const valorTransferencia = Number(valor);

    if (contaOrigem.saldo < valorTransferencia) {
        return res.status(403).json({ mensagem: 'Valor da transferência maior que saldo disponível' });
    }


    contaOrigem.saldo -= valorTransferencia;
    contaDestino.saldo += valorTransferencia;

    const newDate = date.format((new Date()), 'yyyy-MM-dd HH:mm:ss')

    transferencias.push({

        data: newDate,
        numero_conta_origem: origem,
        numero_conta_destino: destino,
        valor: valorTransferencia


    })

    return res.status(200).json();
}


function verificarSaldo(req, res) {
    const { numero_conta } = req.query

    const indexUser = functions.indexId(Number(numero_conta))
    const saldo = contas[indexUser].saldo

    return res.status(200).json({ saldo: saldo })
}


function exibirExtrato(req, res) {
    const { numero_conta } = req.query;
    const id = Number(numero_conta);

    const deposito = functions.filtro(id, depositos);

    const saque = functions.filtro(id, saques);

    const transferenciasEnviadas = transferencias.filter(conta => conta.numero_conta_origem === id);
    const transferenciasRecebidas = transferencias.filter(conta => conta.numero_conta_destino === id);

    return res.status(200).json({ deposito, saque, transferenciasEnviadas, transferenciasRecebidas });


}



module.exports = {
    createAcount,
    atualizarUsuario,
    deletarUsuario,
    depositar,
    sacar,
    transferir,
    verificarSaldo,
    exibirExtrato,

}