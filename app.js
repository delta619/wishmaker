const express = require('express');
const { v1:uuidv1,v4: uuidv4 } = require('uuid');

const app = express();
// const donorRoute = require('./routes/donorRoute');
// const patietRoute = require('./routes/patientRoute');
// const adminRoute = require('./routes/adminRoute');
// const publicRoutes = require('./routes/publicRoute')

const Hit = require('./models/hitModel');

// const globalErrorController = require('./controller/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
// GLOBAL
// const {PintDataClass} = require('./utils/PintDataClass');
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

// fetch initial data 
// const p = new PintDataClass()
app.use('/static', express.static('public'))
app.get('/',(req,res)=>{
  console.log("Got a hit ### "+ new Date(Date.now() +11*30*60*1000).toUTCString() );
  Hit.create({
    hit:1,
    identity: uuidv4(),
    timestamp: new Date(Date.now() + 11*30*60*1000)
  })
  res.sendFile(path.join(__dirname,'public','index.html'))
})



// app.use('/api/public', publicRoutes);
// app.use('/api/donor', donorRoute);
// app.use('/api/patient', patietRoute);
// app.use('/api/admin', adminRoute);


app.all('*', (req, res, next) => {
  return res.status(204).end();
});

// app.use(globalErrorController);

exports.Server = app;
