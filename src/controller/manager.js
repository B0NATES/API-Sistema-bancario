const {contas} = require('../database')


function openUsers (req, res){
    res.status(200).json(contas)
}

module.exports = {
    openUsers
}