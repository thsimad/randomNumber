const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	registeredDate: {
        type: Date, default: Date.now
    },
    role:{
        type: String,
        default: 'student'
    },
    applied:{
        type: Boolean,
        default: false
    },
	name: String,
	linkedinId: {
     type: String   
    },
    // facebookId:{
    //     type: String
    // },
    googleId:{
        type: String
    },
    fblink:{
        type: String
    },
    
    skills:{
        type:String
    },
	email: {
        type: String,
        lowercase: true
    },
    mobile: {
        type: Number
    },
    description:{
        type: String
    },
    linkedinProfileUrl:{
        type: String
    },
    linkedinUrl:{
        type: String
    },
    linkedinHeadline:{
        type: String
    },
    skills:{
        type: String
    },
    ideas:{
        type: String
    },
    inspiredBy:{
        type: String
    },
    links:{
        linkedin:{
            type: String
        },
        twitter:{
            type: String
        },
        facebook:{
            type: String
        }
    },
    designation:{
        type: String
    },
    codingBackground:{
        type: String
    },
    joiningObjective:{
        type: String
    },
    batchType:{
        type: String
    },
    source:{
        type: String
    },
    location:{
        type: String
    },
    expectations:{
        type: String
    },
    recommendation:{
        type: String
    },
    refEmail: {
        type: String
    },
    finassistance:{
        type: String
    },
    reminder:{
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('user', UserSchema);