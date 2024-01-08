const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/wishlist', wishlistRoutes);

app.get('/jobsearch', async (req, res) => {
  try {
    const {
      query,
      page,
      employment_types,
      country,
      num_pages,
      date_posted,
    } = req.query;

    const queryParams = {
      ...(query && { query }),
      ...(page && { page }),
      ...(employment_types && { employment_types }),
      ...(country && { country }),
      ...(num_pages && { num_pages }),
      ...(date_posted && { date_posted }),
    };

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: queryParams,
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios(options);
    res.json(response.data);
  } catch (error) {
    console.log(error.response.data);
    res.status(500).json(error.response.data);
  }
});

app.get('/job-details', async (req, res) => {
  try {
    const {
      query,
      page,
      employment_types,
      country,
      num_pages,
      date_posted,
    } = req.query;

    const queryParams = {
      ...(query && { query }),
      ...(page && { page }),
      ...(employment_types && { employment_types }),
      ...(country && { country }),
      ...(num_pages && { num_pages }),
      ...(date_posted && { date_posted }),
    };

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/job-details',
      params: queryParams,
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios(options);
    res.json(response);
  } catch (error) {
    res.status(500).json(error.response.data);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
