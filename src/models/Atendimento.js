const moment = require("moment");
const conexao = require("../infra/conexao");

class Atendimento {
    adiciona(atendimento, res) {
        // Formatação da data enviada e criação dataCriacao
        const data = moment(atendimento.data, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss');
        const dataCriacao = moment(new Date()).format('YYYY-MM-DD[T]HH:mm:ss');

        // Checar se a data enviada é válida
        const dataEhvalida = moment(data).isSameOrAfter(dataCriacao)

        // Checar se Nome é válido
        const clienteEhValido = atendimento.cliente.length >= 5

        // Array padronizado com respostas em caso de Erro
        const validacoes = [
            {
                nome: 'data',
                validator: dataEhvalida,
                mensagem: `Data deve ser Posterior a data atual`,
            },
            {
                nome: 'cliente',
                validator: clienteEhValido,
                mensagem: `Cliente deve ter mais de 5 Letras`
            }
        ]


        // Filtrar erros
        const erros = validacoes.filter(val => !val.validator)
        const existemErros = erros.length

        // Error First
        if (existemErros) {
            res.status(400).json(erros)
        } else {
            // Objeto para ser enviado ao banco de dados
            const atendimentoDatado = { ...atendimento, data, dataCriacao }

            // Query para o DB
            const sqlQuery = `INSERT INTO Atendimentos SET ?`

            // Função de Query
            conexao.query(sqlQuery, atendimentoDatado, (error, resultados) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    res.status(201)
                        .json(atendimento)
                }
            })
        }
    }

    lista(res) {
        const sqlQuery = 'SELECT * FROM Atendimentos'

        conexao.query(sqlQuery, (error, resultados) => {
            if (error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorID(id, res) {
        const sqlQuery = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sqlQuery, (error, resultados) => {
            if (error) {
                res.status(400).json(error)
            } else {
                if (resultados.length) {
                    res.status(200).json(resultados)
                } else {
                    res.status(404).json(resultados)
                }
            }
        })
    }

    altera(id, valores, res) {
        // Lista de erros 
        const erros = []

        // Tratamento de data caso mudou
        if (valores.data) {
            const data = moment(valores.data, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss')
            const dataEhValida = moment(data).isSameOrAfter(new Date())
            if (dataEhValida) {
                valores.data = data
            } else {
                erros.push({
                    nome: "Data",
                    mensagem: "Data precisa ser posterior ao momento de alteração"
                })
            }
        }

        // Se Nome mudou Checar por erros
        if (valores.cliente) {
            const clienteEhValido = valores.cliente.length >= 5
            if (!clienteEhValido) {
                erros.push({
                    nome: "Cliente",
                    mensagem: "Cliente precisa ter mais que 5 letras"
                })
            }
        }


        // Error First
        if (erros.length) {
            res.status(400).json(erros)
        } else {
            const sqlQuery = `UPDATE Atendimentos SET ? WHERE id=?`

            conexao.query(sqlQuery, [valores, id], (error, resultados) => {
                if (error) {
                    res.status(400).json(error)
                } else {
                    res.status(200).json({ id, ...valores })
                }
            })
        }

    }

    deletar(id, res) {
        const sqlQuery = "DELETE FROM Atendimentos WHERE id=?"

        conexao.query(sqlQuery, id, (error, resultados) => {
            if (error) {
                console.log(error)
                res.status(400).json(error)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new Atendimento()