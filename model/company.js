const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    profile:{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
    },
company_name: {
    type: String,
    required: true
},
 website: {
    type: String,
    required: true
},
  logo_url: {
    type: String,
    required: true
},
   short_description: {
    type: String,
    required: true
},
jobposts:{ 
    type: [{
    type: Schema.Types.ObjectId,
    ref: 'Jobpost'
           }]      
}
    },
     { timestamps: true }
    )
    const Company = mongoose.model('Company', companySchema)
module.exports = Company