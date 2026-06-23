const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['doctor', 'caregiver', 'patient'],
        default: 'patient'
    },

    // ---------- Patient Profile ----------

    patient_id: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    },

    dob: {
        type: Date,
        default: null
    },

    fitnessLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },

    // Doctors / Caregivers can monitor multiple patients

    patient_ids: {
        type: [String],
        default: []
    }

},
{
    timestamps: true
});

// Hash password before saving

UserSchema.pre('save', async function(next){

    if(!this.isModified('password'))
        return next();

    try{

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);

        next();

    }
    catch(err){

        next(err);

    }

});

// Compare password

UserSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password);

};

// Calculate age dynamically

UserSchema.virtual('age').get(function(){

    if(!this.dob)
        return null;

    const today = new Date();

    let age = today.getFullYear() - this.dob.getFullYear();

    const month = today.getMonth() - this.dob.getMonth();

    if(
        month < 0 ||
        (month === 0 && today.getDate() < this.dob.getDate())
    ){
        age--;
    }

    return age;

});

UserSchema.set('toJSON',{ virtuals:true });
UserSchema.set('toObject',{ virtuals:true });

module.exports = mongoose.model('User', UserSchema);