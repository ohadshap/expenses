const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./server/routes/api')
const mongoose = require('mongoose')
const data = require('./expenses.json')
const Expense = require('./server/models/Expense')

const app = express()
mongoose.connect("mongodb://localhost/mongoose-expense",  {useNewUrlParser: true,  useUnifiedTopology: true } )
app.use(express.static(path.join(__dirname,  'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', api)


const port = 3000
app.listen(port, function(){
    console.log(`Running server on port ${port}`)
})


// for(let datum of data) {
//     let info = new Expense({
//         amount: datum.amount,
//         group: datum.group,
//         date: datum.date,
//         item: datum.item
//     })
//     info.save()
// }
