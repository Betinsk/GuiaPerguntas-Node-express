const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

//database
connection.authenticate().then(() => {
    console.log("Conexão feita com o banco")
}).catch((msgErro) => {
    console.log(msgErro)
})


//Estou dizendo para o express usar o EJS como view engine
app.set('View engine', 'ejs')
app.use(express.static('public')) // Aplicacao aceita arquivos externos

//bodyparser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//rotas
app.get("/",(req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //ASC = crescente | DESC = decrescente
    ]}).then(perguntas => {
        console.log(perguntas)
        res.render("index.ejs", {
            perguntas: perguntas
    })
    })
})

app.post("/salvarpergunta",(req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res)=> {
    var id = req.params.id 
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //Pergunta achada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(resposta =>{
            res.render("pergunta.ejs",{
                pergunta: pergunta,
              resposta: resposta
            })
         })
        }else { //Não encontrada
            res.redirect('/')
        }
    })
})

app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo
    var idPergunta = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: idPergunta
    }).then(() =>{
        res.redirect("/pergunta/" + idPergunta)
})
})

    app.get("/perguntar",(req, res) => { 
        res.render("perguntar.ejs")
    })


  /*  var nome = req.params.nome
    var lang = req.params.lang

    var exibirMsg = true

    var produtos = [
        {nome: "Mouse", preco: 3.14},
        {nome: "Cocacola", preco: 3.15},
        {nome: "dis", preco: 6.15}
    ]


    res.render("home.ejs", {nome: nome, lang: lang,
        empresa: "minha empresa",
        msg: exibirMsg,
        produtos: produtos
    })
    */


app.listen(8080,() => {
    console.log("App rodando!")
})