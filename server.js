const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');


const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ankit:onBArDwKZlDFcS1f@cluster0.1lr1zyp.mongodb.net/bewery';
const sessionSecret = process.env.SESSION_SECRET || 'iambatman@12';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));
app.use(flash());


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);


const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  breweryname: {
    type: String,
    required: true,
  }
  ,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Set up routes



// app.get('/', (req, res) => {
//     res.sendFile('login.html', { root: __dirname });
//   });

//   app.get('/signup.html', (req, res) => {
//     res.sendFile('signup.html', { root: __dirname });
//   });

//   app.get('/login.html', (req, res) => {
//     res.sendFile('login.html', { root: __dirname });
//   });

app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.redirect('/login.html');
  });
  
  app.get('/signup', (req, res) => {
    res.redirect('/signup.html');
  });
  
  app.get('/login', (req, res) => {
    res.redirect('/login.html');
  });
  

 
 
  

app.post('/signup', async (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.name;
    const password = req.body.password;
      
   

      if(password) 
      {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
      }

   
    
  
  
    res.redirect('/login.html');
  } catch (error) {
   
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/');
  }
});

app.post('/login', async (req, res) => {
  try {
    const username = req.body.name; 
    const password = req.body.password;

    const user = await User.findOne({ username: username }); 
         
  
    

    
    if (user && (await bcrypt.compare(password, user.password))) {
      
     
      res.redirect('/search.html');
    } else {
      console.log("not matching yehe!!");
      // req.flash('error', 'Invalid Credentials');
      res.status(401).redirect('/');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/');
  }
});











app.get('/getFeedback', async (req, res) => {
  try {
    const breweryName = req.query.breweryName; 

   
    const feedbackList = await Feedback.find({ breweryname: breweryName });

    res.json(feedbackList);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






app.post('/submit-feedback', async (req, res) => {
  try {
    const { email, feedback, rating} = req.body;
    const breweryname = req.body.hiddenInput; 

   
    const newFeedback = new Feedback({
      email,
      feedback,
      rating,
      breweryname
    });

    
    await newFeedback.save();
   
    res.redirect('/breweryResults.html');
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', 'Something went wrong!');
  res.status(500).redirect('/');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
