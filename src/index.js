const customExpress = require('./config/customExpress')
const conexao = require('./infra/database/conexao')
const Tabelas = require('./infra/database/tabelas')

conexao.connect((error) => {
    if (error) {
        console.error(error)
    } else {
        const app = customExpress()

        Tabelas.init(conexao)
        app.listen(3000, () => console.log("Server port 3000"))
    }
})
