const fs = require('fs')
const path = require('path')

/**
 * Asyncronous Function
 */
module.exports = (caminho, nomeDoArquivo, cbImagemCriada, cbError) => {

    const tiposValidos = ['.jpg', '.jpeg', '.png']

    const extensao = path.extname(caminho)

    if (!tiposValidos.includes(extensao)) {
        cbError(`Extensão '${extensao}' inválida, o arquivo precisa ser ${tiposValidos}`)
    } else {
        const novoCaminho = `./src/assets/imagens/${nomeDoArquivo}${extensao}`

        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('error', (err) => cbError(err))
            .on('finish', () => cbImagemCriada(novoCaminho))
    }
}

/**
 * Synchronous function
 */

// fs.readFile('./src/assets/doguinho.jpg', (error, buffer) => {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log("Arquivo lido");
//         console.log(buffer)

//         fs.writeFile("./salcinha2.jpg", buffer, (error) => {
//             if (error) {
//                 console.error(error);
//             } else {
//                 console.log("imagem Escrita");
//             }
//         })
//     }
// })