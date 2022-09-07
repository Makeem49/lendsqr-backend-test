const mongoose = require('mongoose');

// db connection
mongoose.connect(process.env.MONGO_DB_URL)
.then(()=> {
    console.log('Database connected...')
}).catch((err) => console.log('Database not connected', err))


// event to fire when database is connected 
mongoose.connection.on('connected', () => {
    console.log('Database is connected.')
})


// event to fire when there is error with database
mongoose.connection.on('err', (error) => {
    console.log(error.message)
})


// event to fire when there is error with database
mongoose.connection.on('disconnected', (error) => {
    console.log('Database connection is disconned.')
})


// close the mongoose connection when application is shut down using control C
// this will make mongoose on disconnected event fired 
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})