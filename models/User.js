const {model,Schema} = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new Schema ({
    username: {type: String, unique: true}, 
    email: {type: String, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['admin', 'user','review'], default: 'user'},
    verified: { type: Boolean, default: false },
    uniqueString:  {type: String}
    
},{timestamps: true}
)
userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) {
          return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
   }
  });
module.exports = new model('User', userSchema);