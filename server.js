const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Middleware -------------------- */
app.use(express.json());

/* ✅ SINGLE, SIMPLE CORS CONFIG (Azure-safe) */
app.use(
  cors({
    origin: 'https://shoppingapp.azurewebsites.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

/* ✅ Explicitly allow preflight */
app.options('*', cors());

/* -------------------- Database -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

/* -------------------- Routes -------------------- */
app.use('/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

/* -------------------- Start Server -------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
