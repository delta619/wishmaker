const express = require('express');
const { v1:uuidv1,v4: uuidv4 } = require('uuid');

const app = express();

const Hit = require('./models/hitModel');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
// GLOBAL
app.use(morgan('dev'));
// protect
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // MAX 100 requests in 1 hr
  message: 'Too many requests from your ip, Please try again in an hour',
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api', limiter);
}

// BODY PARSER
app.use(express.json({ limit: '10kb' }));

// prevent NOSQL injection
app.use(mongoSanitize());

// prevent xss

app.use(xss());

// setting global cors

// if(process.env.NODE_ENV == "development"){
app.use(cors());
// }

// prevent parameter pollution

// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price',
//     ],
//   })
// );

app.use(express.urlencoded({ extended: true }));

const fs = require("fs");
// fetch initial data 
app.use('/api/submit/:identity',(req,res)=>{
  Hit.update({identity:req.params.identity},{message:req.body.wish}).then(res=>{
    console.log("message linked with id "+req.param.identity);
  })
  res.end()
})
app.use('/static', express.static('public'))
app.get('/',(req,res)=>{
  identity = uuidv4()
  console.log("Got a hit ### "+ new Date(Date.now() +11*30*60*1000).toUTCString() );
  Hit.create({
    hit:1,
    identity: identity,
    timestamp: new Date(Date.now() + 11*30*60*1000)
  }).then(res=>{
    console.log("Identity saved");
  })

  let html = fs.readFile(path.join(__dirname,'public','index.html'),'utf-8',(err,data)=>{
    data = data.replace('{{identity}}',identity)
    res.send(data)
  })

})





app.all('*', (req, res, next) => {
  return res.status(204).end();
});

// app.use(globalErrorController);

exports.Server = app;
