import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

screenSchema.index({ name: 'text' });

export default mongoose.model('Screen', screenSchema);