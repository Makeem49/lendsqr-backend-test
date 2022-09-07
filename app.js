const app = require("./index")
// custom import 
require('dotenv').config()
require('./src/helpers/init_mongodb');

app.listen(PORT , () => {
    console.log(`Listen to port ${PORT}`)
})