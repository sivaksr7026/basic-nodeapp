const mongoose = require('mongoose')

const EmployeedbSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
     enum: ["admin", "employee"],
    default: "employee"
  },
  phone: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Employeedb', EmployeedbSchema)
