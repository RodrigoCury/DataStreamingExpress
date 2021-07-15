const Atendimento = require('../models/Atendimento')

module.exports = app => {
    app.post('/atendimento', (req, res) => {
        const atendimento = req.body
        Atendimento.adiciona(atendimento)
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })

    app.get('/atendimento', (req, res) => {
        Atendimento.lista()
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })

    app.get('/atendimento/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Atendimento.buscaPorID(id)
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })

    app.patch('/atendimento/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const valores = req.body

        Atendimento.altera(id, valores)
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })

    app.delete('/atendimento/:id', (req, res) => {
        const id = parseInt(req.params.id)
        console.log(id);

        Atendimento.deletar(id)
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => res.status(400).json(erro))
    })
}