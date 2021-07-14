class Tabelas {
    init(conexao) {
        this.conexao = conexao
        console.log("Conectado a DB");
        this.criarAtendimento()
        this.criarPets()
    }

    criarAtendimento() {
        const sqlQuery = 'CREATE TABLE IF NOT EXISTS Atendimentos (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar(20), servico varchar(20) NOT NULL, data datetime NOT NULL, dataCriacao datetime NOT NULL, status varchar(20) NOT NULL, observacoes text, PRIMARY KEY(id))'
        this.conexao.query(sqlQuery, (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log('tabela Atendimentos acessada com sucesso')
            }
        })
    }

    criarPets() {
        const sqlQuery = 'CREATE TABLE IF NOT EXISTS Pets (id int NOT NULL AUTO_INCREMENT, nome varchar(50), imagem varchar(200), PRIMARY KEY (id))'

        this.conexao.query(sqlQuery, erro => {
            if (erro) {
                console.error(erro)
            } else {
                console.log("Tabela Pets acessada com sucesso")
            }
        })
    }
}

module.exports = new Tabelas();