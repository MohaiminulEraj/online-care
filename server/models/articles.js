const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const session = require('express-session');
// const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// const express = require('express')
// const app = express()
// app.use(session({
//   secret: "My little secret string lol.",
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

const ArticleSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    topic : {  // will be replaced with department
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    file1: {
        data: Buffer,
        contentType: String
    },
    causes: { 
        type: String, 
        required: true
    },
    stages: {
        type: String,
        required: true
    },
    file2: {
        data: Buffer,
        contentType: String
    },
    consequences: {
        type: String,
        required: true
    },
    remedies: {
        type: String,
        required: true
    },
    file3: {
        data: Buffer,
        contentType: String
    },
    question: {
        type: String,
        required: true
    },
    prevention: {
        type: String,
        required: true
    },
    adverse: {
        type: String,
        required: true
    },
    sideEffect: {
        type: String,
        required: true
    },
    diagnosis: {
        type: [String],
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    docId: {
        type: [String],
        required: true
    },
    refLink: {
        type: String,
        required: true
    },
    thumbnail: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });


const Article = mongoose.model('Article', ArticleSchema);


module.exports = Article;