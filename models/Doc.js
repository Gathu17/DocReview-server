var {model,Schema} = require("mongoose") 
const docSchema = new Schema({
   userId: {type: String},
   documents: [{
    name: String,
    file: { type: Buffer, contentType: String, required: true}
}],
   comments: [
    {
        body: String,
    }
   ],
   status: {type: String, default: 'pending'}

},{timestamps: true}
)
module.exports = new model('Doc', docSchema);