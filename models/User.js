import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{ 
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
  }],
  orders: [{
    orderID: { type: String },
    items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, quantity: Number }],
    status: { type: String, default: 'Pending' }
  }]
});

const User = mongoose.model('User', UserSchema);
export default User;
