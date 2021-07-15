
const conexao = require("../infra/database/conexao");

const Repositorio = require('../repositorios/atendimento')

const moment = require("moment");
const { default: axios } = require("axios");

class Atendimento {

    constructor() {
        // Função de validação
        this.valida = parametros => {
            this.validacoes.filter(campo => {
                const { nome } = campo
                const parametro = parametros[nome]

                return !campo.validator(parametro)
            })
        }

        // Array padronizado com respostas em caso de Erro
        this.validacoes = [
            {
                nome: 'data',
                validator: this.dataEhvalida,
                mensagem: `Data deve ser Posterior a data atual`,
            },
            {
                nome: 'cliente',
                validator: this.clienteEhValido,
                mensagem: `CPF deve ter apenas 11 Digitos`
            }
        ]

        // Checar se a data enviada é válida
        this.dataEhvalida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao)

        // Checar se Nome é válido
        this.clienteEhValido = (tamanho) => tamanho == 11
    }

    adiciona(atendimento, res) {
        // Formatação da data enviada e criação dataCriacao
        const data = moment(atendimento.data, "DD/MM/YYYY").format('YYYY-MM-DD[T]HH:mm:ss');
        const dataCriacao = moment(new Date()).format('YYYY-MM-DD[T]HH:mm:ss');

        const parametrosDeValidacao = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }

        // Filtrar erros
        const erros = this.valida(parametrosDeValidacao)
        const existemErros = erros.length

        // Error First
        if (existemErros) {
            return new Promise((resolve, reject) => reject(erros))
        } else {
            // Objeto para ser enviado ao banco de dados
            const atendimentoDatado = { ...atendimento, data, dataCriacao }

            // 
            return Repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.id
                    return { ...atendimentoDatado, id }
                })
        }
    }

    lista() {
        return Repositorio.lista()
    }

    buscaPorID(id) {
        return Repositorio.buscaPorID(id)
            .then(async (resultados) => {
                const atendimento = resultados[0]
                const cpf = atendimento.cliente

                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                atendimento.cliente = data

                return atendimento
            })
    }

    altera(id, valores) {
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
            return new Promise((resolve, reject) => reject(erros))
        } else {
            return Repositorio.altera(id, valores)
                .then(resultados => {
                    return { id, ...resultados }
                })
        }

    }

    deletar(id) {
        return Repositorio.deletar(id)
            .then(resultados => {
                return `ID ${id} foi Deletado`
            })
    }
}

module.exports = new Atendimento()