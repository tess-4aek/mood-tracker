import mongoose from 'mongoose'

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    note: {
      type: String,
      default: '',
      maxlength: 5000
    }
  },
  { timestamps: true }
)

moodEntrySchema.index({ userId: 1, date: 1 }, { unique: true })

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema)
