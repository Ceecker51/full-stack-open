const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

// connect to database
console.log("Connecting to ", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

// define db schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// setup json convertion
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);