import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },  // e.g., Fruit, Vegetable, Non-veg
  stock: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Item = mongoose.model('Item', ItemSchema);
export default Item;
