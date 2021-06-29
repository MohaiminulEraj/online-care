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

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    dateofbirth: {
        type: Date,
        required: true,
        default: '12/10/1000'
    },
    gender: {
        type: String,
        required: true,
        default: 'Gender'
    },
    profileImg: String,
    fatherId: String,
    mohterId: String,
    spouseId: String,
    childId: [String],
    city: {
        type: String,
        required: true,
        default: 'City'
    },
    country: {
        type: String,
        required: true,
        default: 'Country'
    },
    zip: {
        type: String,
        required: true,
        default: 'zip'
    },
    phone: {
        type: String,
        required: true,
        default: '0'
    },
    license_no: {
        type: String,
        required: true,
        unique: true,
        default: '0'
    },
    university: {
        type: String,
        required: true,
        default: 'University'
    },
    dept_doc: {
        type: String,
        required: true,
        default: 'dept'
    },
    reference_no: {
        type: [String],
        required: true,
        default: '(Seperated By Comma)'
    },
    articles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]

}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

module.exports = User;