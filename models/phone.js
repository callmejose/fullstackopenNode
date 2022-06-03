const mongoose = require('mongoose')

// "mongodb+srv://api-test:${ password }@cluster0.qzlffvu.mongodb.net/${ database }?retryWrites=true&w=majority"
const url = process.env.MONGODB_URI.replace(
  '${{ MONGOUSER }}',
  process.env.MONGOUSER
).replace(
  '${{ PASSWORD }}',
  process.env.PASSWORD
).replace(
  '${{ DATABASE }}',
  process.env.DATABASE
)
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^[0-9]{2,3}[-][0-9]{1,}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number`
    },
    required: true
  }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', phoneSchema)
