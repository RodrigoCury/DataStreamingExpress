const query = require('../infra/database/queries.js');

class Atendimento {
    adiciona(atendimento) {
        // Query para o DB
        const sqlQuery = `INSERT INTO Atendimentos SET ?`

        return query(sqlQuery, atendimento)
    }

    lista() {
        const sqlQuery = 'SELECT * FROM Atendimentos'

        return query(sqlQuery)
    }

    buscaPorID(id) {
        const sqlQuery = `SELECT * FROM Atendimentos WHERE id=${id}`

        return query(sqlQuery)
    }

    altera(id, valores) {
        const sqlQuery = `UPDATE Atendimentos SET ? WHERE id=?`

        return query(sqlQuery, [valores, id])
    }

    deletar(id) {
        const sqlQuery = "DELETE FROM Atendimentos WHERE id=?"

        return query(sqlQuery, id)
    }
}

module.exports = new Atendimento()