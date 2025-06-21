import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'piece', 'bunch', 'dozen'],
      default: 'kg',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [{
      type: String, // URLs to images
    }],
    // Fields from SRS to highlight USPs
    sourcingDetails: {
      type: String,
      trim: true,
    },
    freshnessTag: {
      type: String, // e.g., "Picked Today", "Farm-fresh"
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    //  isDeleted: {
    //   type: Boolean,
    //   default: false,
    //   index: true, // Index this for faster queries
    // },
      // --- ADD THIS FIELD ---
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, 
    },  
  },
  { timestamps: true }
);

// Create a text index for searching
productSchema.index({ name: 'text', description: 'text', category: 'text' });
// --- NEW METHOD ---
// This ensures that normal find queries automatically filter out deleted products.
productSchema.pre(/^find/, function(next) {
  // `this` is the query
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;