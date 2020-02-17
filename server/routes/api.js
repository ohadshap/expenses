const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Expense = require('../models/Expense')
let moment = require('moment')
mongoose.connect("mongodb://localhost/mongoose-exercise",  {useNewUrlParser: true,  useUnifiedTopology: true } )


router.get('/expenses', function (req, res) {
    Expense.find({}, function(e, expense) {   
        res.send(expense) 
    })
    .sort({date: 1})  
})

router.post('/new', function (req, res) {
    let data = req.body
    let expense = new Expense({
        amount: data.amount,
        group: data.group,
        item: data.item,
        date: (data.date ? data.date : moment().format('LLLL'))    
    })
    expense.save()
    console.log(`I spent ${expense.amount} on ${expense.item}`)
    res.send(expense)
})

router.put('/update/:group1/:group2', function (req, res) {
    let currGroup = req.params.group1
    let newGroup =  req.params.group2
    Expense.findOne({
        group: `${currGroup}`
    })
    .exec(function(err, response) {
        response.group = `${newGroup}`
        response.save()
        res.send(response)
    })
})

router.get('/expenses/:group', function (req, res) {
    let group = req.params.group
    let { q, d1, d2 } = req.query
    
    if(q == `total`) {
        if(d1 == undefined) {
            Expense.aggregate([
                {$match: {group}},
                { $group: {
                    _id: `$group`,
                    totalAmount: {$sum: "$amount"}
                }
            }])
            .exec(function(err, response) {
                res.send(response)
            })
        } else if(d2) {
            Expense.find({
                $and: [
                    {group: `${group}`},
                    {date: {$gt: d1}},
                    {date: {$lt: d2}}
                ]
            })
            .exec(function(err, response) {
                res.send(response)
            })
        } else {
            Expense.find({
                $and: [
                    {group: `${group}`},
                    {date: {$gt: `${d1}`}},
                    {date: {$lt: moment().format('LLLL')}}
                ]
            })
            .exec(function(err, response) {
                res.send(response)
            })
        }
    } else {
        Expense.find({
            group: `${group}`
        })
        .exec(function(err, response) {
            res.send(response)
        })
    }
})

module.exports = router