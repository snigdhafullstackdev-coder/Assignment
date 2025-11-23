import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  itemUrls: [{
    type: String,
    validate: {
      validator: function(url) {
        return url.length <= 0 || /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Invalid URL format'
    }
  }]
}, {
  timestamps: true
});

playlistSchema.index({ name: 'text' });

playlistSchema.virtual('itemCount').get(function() {
  return this.itemUrls.length;
});

export default mongoose.model('Playlist', playlistSchema);