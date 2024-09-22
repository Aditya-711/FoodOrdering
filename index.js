import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import User from './models/User.js';
import Item from './models/Item.js';


const app = express();
app.set('view engine','ejs');

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

// Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser());

let currentUser;
let url = "mongodb+srv://adityainamdar711:Cr%407rocks@adityacluster.rr8bu.mongodb.net/";
let url1 = "mongodb+srv://adityainamdar711:Cr%407rocks@adityacluster.rr8bu.mongodb.net/?retryWrites=true&w=majority&appName=AdityaCluster";
let url2 = "mongodb://localhost:27017/adityadb";
// MongoDB Connection
mongoose.connect(url1, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));
 
// Routes
// const user = await User.findOne({"email":"123@gmail.com"});
// const newUser = new User({ "email":"tempemail", "password": "123" });
//console.log("user here:"+newUser);
// Registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    console.log("user in /register: "+newUser.email);

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password= req.body.password;
  try {
    
    const user = await User.findOne({ email });
    console.log("user in /login: "+user.email);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    currentUser = user;
    res.cookie('token', token, { httpOnly: true });
   // res.json({ message: 'Logged in successfully' });
    res.redirect("/items");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "User not found" });
  }
});

app.get("/items",(req,res)=>{
    res.render("items.ejs",{"user":currentUser});
})
// Browse Items by Category
app.get('/items/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const items = await Item.find(category === 'All' ? {} : { category });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch items' });
  }
});

// Add to Cart
app.post('/cart', async (req, res) => {
  const itemId = req.body.itemId;
    const quantity = 1;
    // console.log("itemid is ="+itemId);
    
  try {
    const user = await User.findById(currentUser.id).populate("cart.item");
    const existingItem = user.cart.find(i => i.item._id.toString() === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ item: itemId, quantity });
    }
    await user.save();
    currentUser = await User.findById(currentUser.id).populate("cart.item");
    res.render("items.ejs",{"user":currentUser});

   // res.json(user.cart);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: 'Unable to add item to cart' });
  }
});

app.get("/cart",(req,res)=>{

})

// Checkout
app.get('/checkout', async (req, res) => {
//  try {
    // const user =  User.findById(currentUser.id).populate('cart.item');
    // let unavailableItems = [];
    // console.log("** user:"+user.cart[0].item.stock);
    

    // for (let cartItem of user.cart) {
    //   if (cartItem.item.stock < cartItem.quantity) {
    //     console.log("***");
        
    //     unavailableItems.push(cartItem.item.name);
    //   }
    // }

    // if (unavailableItems.length > 0) {
    //   return res.status(400).json({ error: `Items not available: ${unavailableItems.join(', ')}` });
    // }

    // // Deduct stock and create order
    // for (let cartItem of user.cart) {
    //   cartItem.item.stock -= cartItem.quantity;
    //    cartItem.item.save();
    // }

    // const orderID = new mongoose.Types.ObjectId();
    // user.orders.push({ orderID, items: user.cart, status: 'Pending' });
    // user.cart = [];
    // user.save();
    // currentUser =  User.findById(currentUser.id);
    //res.json({ message: 'Order placed successfully', orderID });
   currentUser = await User.findById(currentUser.id).populate('cart.item');
//    console.log(currentUser.cart[0].item.name+"  "+currentUser.cart[1].item.name);
 
    res.render("checkout",{"userForCheckout":currentUser.cart});
 // } catch (error) { 
    //res.status(500).json({ error: 'Checkout failed' });
 // } 
}); 
app.get('/transactionDone',(req,res)=>{
    res.render("transactionDone.ejs");
})
app.get('/',(req,res)=>{ 
    res.render("Login.ejs");
})
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});