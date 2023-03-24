import { Document, Schema, Model, model } from 'mongoose'

export interface IMessage extends Document {
  message: String,
  user_id: String,
  created_at: String
}

export const messageSchema: Schema = new Schema({
  message: String,
  user_id: String,
  created_at: String
})

export const Message: Model<IMessage> = model<IMessage>('Message', messageSchema)
