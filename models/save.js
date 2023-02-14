const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema object
const obj = {
  data: {
    type: Object,
  },
  email: {
    type: String,
  },
  user_data: {
    type: Object,
  },
};

//schema setup
const schemaObj = new Schema(obj);
//model setup
const QuizeInfo = mongoose.model("quizeinformation", schemaObj);

//exports
module.exports = QuizeInfo;
