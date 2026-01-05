import mongoose from 'mongoose'

export interface IEvent {
  title: string
  content: string
  date: Record<string, any> | null
  owner: mongoose.Types.ObjectId
  status: 'pending' | 'completed'
  createdAt: Date
}

const EventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
