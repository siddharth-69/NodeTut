const express = require("express");
const path = require("path")
const authRoutes = require('./routes/authRoutes')


const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log('you are connected to the server')
})