const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const authRoutes = require('./routes/authRoutes');
require("dotenv").config();

app.use(express.json());

const PORT = process.env.PORT || 6000 ;

dbConnect();

app.use("/api/v1",authRoutes);

app.listen(PORT,()=>{
    console.log(`App Started Successfully at ${PORT}`);
})

//default route
app.get("/",(req,res)=>{
    res.send("<h1>Login App is Connected</h1>");
})
