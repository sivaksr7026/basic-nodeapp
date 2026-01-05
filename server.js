const express =  require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const employeeRoutes = require('./routes/employeeRoutes')


dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json());

app.use(express.json())

app.use(
  cors({
    origin: ["https://shoppingapp.azurewebsites.net"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// Define the specific allowed origins
const allowedOrigins = ['https://shoppingapp.azurewebsites.net/', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) or from the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
  

app.use('/employees', employeeRoutes)


 app.get('/', (req, res) => {
  res.send('Server is running')
})
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
