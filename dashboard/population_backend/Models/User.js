import { Schema, model } from 'mongoose';

// Define the schema for the user data
const userSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  population: {
    type: Number,
    required: true
  },
  yearlyChange: {
    type: String,  // storing the percentage as a string (could be Number if needed)
    required: true
  },
  netChange: {
    type: Number,
    required: true
  },
  density: {
    type: Number,  // people per km²
    required: true
  },
  landArea: {
    type: Number,  // in km²
    required: true
  },
  migrantsNet: {
    type: Number,
    required: true
  },
  fertilityRate: {
    type: Object,  // this can hold multiple data or subfields related to fertility
    required: false
  },
  mortalityRate: {
    type: Object,  // this can hold multiple data or subfields related to mortality
    required: false
  },
  urbanPopulationPercentage: {
    type: String,  // storing percentage as a string
    required: true
  },
  worldShare: {
    type: String,  // storing percentage as a string
    required: true
  }
}, { timestamps: true });

// Create the model from the schema
const User = model('User', userSchema);

export default User;
