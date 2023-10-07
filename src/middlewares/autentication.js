const {banco, contas} = require ('../database');
const functions = require('../controller/functions')




function verificarAutenticacao (req, res, next){
    const {senha_banco} = req.query;
    if (!senha_banco) {
        return res.status(401).json({mensagem: "Usuario não autenticado"});
        
        
    }
    if (senha_banco !== banco.senha){
        return res.status(401).json({mensagem: "A senha do banco informada é inválida!"});
        
    }
    next()
}

function autenticarUser (req, res, next) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Digite as informações necessárias' })
    }

    const indexUser = functions.indexId(Number(numero_conta));

    if (indexUser === -1) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    const userSenha = contas[indexUser].usuario.senha;

    if (userSenha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    next();
}

function validarBody(camposObrigatorios) {
    return function (req, res, next) {
        for (let campo of Object.keys(camposObrigatorios)) {
        

            if (!req.body[campo]) {
                return res.status(400).json({ mensagem: `Campo '${campo}' é obrigatório` });
            }
        }

        next();
    };
}

function validarIdInParams (req, res, next){
    const { numeroConta } = req.params
    const id = Number(numeroConta);


    const verificarId = functions.verificarId(id);

    if (!verificarId) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' })
    }

    next()
}

function validarIdInBody (req, res, next){
    const { numero_conta} = req.body;
    const id = Number(numero_conta);

    if (!functions.verificarId(id)) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' })
    }

    next()

    
}






module.exports = {
    verificarAutenticacao,
    autenticarUser,
    validarBody,
    validarIdInParams,
    validarIdInBody
}