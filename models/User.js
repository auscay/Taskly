const mongoose = require('mongoose')

//Define a schema
const Schema = moogoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    role: {
        type: String,
        enum: ['owner', 'user'], 
        default: 'user'
    },

    createdAt : {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// before save
UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
  
    this.password = hash;
    next();
  })
  
  UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel