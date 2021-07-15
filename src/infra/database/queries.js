const conexao = require('./conexao')

const executaQuery = async (query, parametros = '') => {
    // Retorna uma Promise com a query do DB
    return new Promise((resolve, reject) => {
        conexao.query(query, parametros, (erro, resultados, campos) => {
            if (erro) {
                reject(erro)
            } else {
                resolve(resultados)
            }
        })
    })
}

module.exports = executaQuery