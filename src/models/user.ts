import { Document, Schema, Model, model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  phone: string
  otp: Number 
  age: Number
  height: string
  weight: string
  bmi: string
  allergies: string
  food_preferences: string 
  token: string
  role_name: string
  profile_image : string
  account_status : string
  sensors_synced : boolean
  gender : string
}

export const userSchema: Schema = new Schema({
  email: String,
  password: String,
  name: String, 
  phone: String, 
  otp: Number, 
  age: Number,
  height: String, 
  weight: String, 
  bmi: String, 
  allergies: String, 
  food_preferences: String, 
  token: String, 
  role_name: {type: String, enum: ['admin', 'user'], default : 'user'},
  gender: {type: String, enum: ['male', 'female', 'others']},
  profile_image: String,
  account_status: {type: String, enum: ['active', 'inactive'], default : 'active'},
  sensors_synced: {type: Boolean, default : false}
})

export const User: Model<IUser> = model<IUser>('User', userSchema)
