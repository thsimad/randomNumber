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
    facebookId:{
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
    userBuild:{
        type: String
    },
    skypeId:{
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
    }
});


module.exports = mongoose.model('user', UserSchema);