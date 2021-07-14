const conexao = require('../infra/conexao')
const uploadDeArquivo = require('../arquivos/uploadDeArquivos')

class Pets {
    adiciona(pet, res) {
        const sqlQuery = `INSERT INTO Pets SET ?`

        uploadDeArquivo(
            pet.imagem,
            pet.nome,
            (novoCaminho) => {
                // Nova instancia de Pet com caminho interno 
                const novoPet = {
                    nome: pet.nome,
                    imagem: novoCaminho
                }

                // DB Query
                conexao.query(sqlQuery, novoPet, erro => {
                    if (erro) {
                        console.error("Houve um erro Durante a Query");
                        console.error(erro);
                        res.status(400).json(erro)
                    } else {
                        res.status(200).json(pet)
                    }
                })
            },
            (erro) => {
                console.log("Houve um erro no Stream")
                console.log(erro)
                res.status(400).json(erro)
            }
        )

    }
}

module.exports = new Pets()