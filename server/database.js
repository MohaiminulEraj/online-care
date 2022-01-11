const mongoose = require('mongoose');
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        // const { request } = require('express');
        mongoose.Promise = global.Promise
        const dbURL = process.env.dbURL //change this if you are using Atlas
        // const dbURL = 'mongodb://localhost:27017/online_medication' //change this if you are using Atlas
        mongoose.connect(dbURL, {
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        mongoose.set("useCreateIndex", true);
        const conn = mongoose.connection;
        conn.on('error', (error) => {
            console.log(error);
        });
    }

}

module.exports = new Database();