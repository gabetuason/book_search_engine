const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dataBase24:UEMjz1z7tnyZ4zLq@cluster0.8gkvzvy.mongodb.net/googlebooks?retryWrites=true&w=majority');

module.exports = mongoose.connection;
