
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5173;

const databaseURL = 'mongodb+srv://karlharloudb:aganharlou1@user-add-product.uold0.mongodb.net/?retryWrites=true&w=majority'

//Both connected
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/products', productRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
