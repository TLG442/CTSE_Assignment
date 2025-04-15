const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//model for users
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      //email validation
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//middleware to hash password before saving to database
userSchema.pre('save', async function (next) {
  //only hash password if it is modified or new
  if (!this.isModified('password')) {
    next();
  }

  //generate salt
  const salt = await bcrypt.genSalt(10);
  //hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

//method to check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;