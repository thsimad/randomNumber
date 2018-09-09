const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	registeredDate: {
        type: Date, default: Date.now
    },
	name: String,
	linkedinId: {
     type: String,
     required: true
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
    skills:{
        type: String
    },
    userBuild:{
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
    joiningObjectives:{
        type: String
    },
    batchType:{
        type: String
    },
    source:{
        type: String
    },
    recommendation:{
        type: String
    }
});


module.exports = mongoose.model('user', UserSchema);