const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobpostSchema2 = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    job_title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    remote: {
        type: String,
        required: true
    },
    job_type: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    apply_link: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    islisted: {
        type: Boolean,
        default: true,
        required: true
    },
    featured: {
        type: {
            isfeatured: {
                type: Number,
                required: true
            },
            featured_created_at: {
                type: Date

            },
            featured_expired_at: {
                type: Date
            }
        }
    }
},
    { timestamps: true }
)
const Jobpost = mongoose.model('Jobpost', jobpostSchema2)
module.exports = Jobpost