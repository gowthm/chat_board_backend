import { Document, Schema, Model, model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  phone: string
  age: Number
}

export const userSchema: Schema = new Schema({
  email: String,
  password: String,
  name: String, 
  phone: String, 
  age: Number,
})

export const User: Model<IUser> = model<IUser>('User', userSchema)
