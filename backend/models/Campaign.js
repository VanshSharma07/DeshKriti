const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  images: {
    main: String,
    gallery: [String]
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Disaster Relief', 'Cultural Preservation', 'Community Development']
  },
  beneficiary: {
    name: String,
    description: String,
    location: String,
    documentProof: String
  },
  updates: [{
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    images: [String]
  }],
  donors: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer'
    },
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  analytics: {
    dailyViews: [{ 
      date: Date, 
      count: Number 
    }],
    shareCount: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add indexes for better query performance
campaignSchema.index({ status: 1, startDate: -1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ featured: 1 });

// Add index for analytics
campaignSchema.index({ 'analytics.dailyViews.date': 1 });

// Add index for slug
campaignSchema.index({ slug: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);