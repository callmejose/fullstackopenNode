require('dotenv').config()
const mongoose = require("mongoose")
// const MONGO = require('./secrets/mongoAtlas.json')

// "mongodb+srv://api-test:${ password }@cluster0.qzlffvu.mongodb.net/${ database }?retryWrites=true&w=majority"
const url = process.env.MONGODB_URI.replace(
    '${{ PASSWORD }}',
    process.env.PASSWORD
).replace(
    '${{ DATABASE }}',
    process.env.DATABASE
)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

// console.log("argsv: ", process.argv, process.argv.length)

if (process.argv.length === 4) {
    const phone = new Phone({
        name: process.argv[2],
        number: process.argv[3]
    })
    phone.save().then(result => {
        console.log(`added ${phone.name} number ${phone.number} to the phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 2) {
    console.log('phonebook:')
    Phone.find({}).then(result => {
        result.forEach(phone => {
            console.log(`${phone.name} ${phone.number}`)
        })
        mongoose.connection.close()
    })
}


