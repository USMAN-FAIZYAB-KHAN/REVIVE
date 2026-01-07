import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const { Schema } = mongoose;

const UserSchema = new Schema ({

    email: {
        type:'String',
        required: true,
        unique: true,
    },

    fullName: {
        type:'String',
        required: true,
    },

    userType: {
        type: 'String',
        enum: ['admin', 'physiotherapist', 'patient'],
        default: 'patient',
    },

    authType: {
        type: 'String',
        enum: ['local', 'google'],
        default: 'local',
    },

    googleId: {
        type: 'String',
        default: null,
    },

    isCompleted: {
        type: 'Boolean',
        default: false,
    },
    
    dateOfBirth: {
        type: 'Date',
        default: null,
    },

    age: {
        type: 'Number',
        default: null,
    },

    gender: {
        type: 'String',
        enum: ['male', 'female', 'other'],
        default: null,
    },

    password: {
        type: 'String',
        required: 'null',
    },

   
    refreshToken: {
        type: 'String',
        default: null
    },

    
    
})


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

const User = mongoose.model('User', UserSchema);
export default User;
