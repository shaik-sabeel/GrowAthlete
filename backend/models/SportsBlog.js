const mongoose = require("mongoose");

const SportsBlogSchema = new mongoose.Schema({
  title :{
    type: String,
    required: true
  },
  summary:{
    type: String
  },
  category:{
    type: String,
    required: true,
    enum:['Cricket','Football','Basketball','Hockey','Psychology','Athletics','Swimming','Badminton','Kabaddi','Traning','Nutrition']
  },
  tags:{
    type:String
  },
  image:{
    typr:String
  },
  content:{
    type: String,
    required: true
  },
  status:{
    type:String,
    required: true,
    enum:['Draft', 'Publish immediately', 'Schedule']
  },
  visibility:{
     type:String,
    required: true,
    enum:['Public', 'Private','Members only']
  }
});

const SportsBlog = mongoose.model("SportsBlog", SportsBlogSchema);

