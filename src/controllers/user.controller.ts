import { Response } from 'express'
import { User } from '../models/user'
import bcryptjs from 'bcryptjs';
import { Message } from '../models/message';
import { JWT_SECRET, REFRESH_SECRET } from '../util/secrets'
import * as jwt from 'jsonwebtoken'


export class UserController {
  // Register
  registerUser = async (req: any, res: Response) => {
    return new Promise(async(resolve, rejects) => {
      const phone = req.body.phone;
      await User.findOne({ phone })
      .then( async(userExist)=>{
        const hashedPassword = await bcryptjs.hash(req.body.password, 12)
        if (userExist) { 
          req.body.password = hashedPassword
          const userUpdate = await User.updateOne({_id:userExist.id},req.body)
          resolve({ message: "User created successfully", status:true  })
        }else{
          const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            phone: req.body.phone,
            age: req.body.age, 
          });
          resolve({message: "User created successfully", status:true  })
        }
      })
    })
  }

  // Login
  authenticateUser = async (req: any, res: Response) => {
    return new Promise(async (resolve, reject) => {
      await User.findOne({ email: req.body.email })
      .then(async (user) => {
        const authorized = await bcryptjs.compare(req.body.password, user.password)
        if (!authorized) {
          resolve({ message: 'email address or password are incorrect', status: false })
        } else {
          const accessToken = jwt.sign({
              id: user.id
          }, JWT_SECRET, {expiresIn: 60 * 60});
    
          const refreshToken = jwt.sign({id: user.id
          }, REFRESH_SECRET, {expiresIn: 24 * 60 * 60 })
    
          res.cookie('accessToken', accessToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
          });
    
          res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              maxAge: 7 * 24 * 60 * 60 * 1000 //equivalent to 7 days
          })
          resolve({
            data : user,
            accessToken:accessToken,
            message: 'Login Successfully',
            status:true
        })
        }
      })
      .catch((err) => reject({ message: "Invalid Credentials", status:false  }));  
    });
  }

  sendMessage = async(req: any, res: Response) => {
    return new Promise(async (resolve, rejects) => {
      await Message.create({
        message: req.body.message,
        user_id: req.user._id,
        created_at: new Date
      }).then(res =>{
        resolve({ message: 'Message sent successfully', status: true})
      }).catch(err => {
        rejects({message: 'Something went wrong', status: false})
      })
    })
  }

  getMessageDetails = async(req: any, res: Response) => {
    return new Promise(async (resolve, rejects) => {
      await Message.aggregate([
        {
          $lookup:  {
            from: 'message',
            localField: 'user_id',
            foreignField: '_id',
            as: 'userData'
          }
        }
      ]).then(res =>{
        resolve({data: res,  message: 'Message sent successfully', status: true})
      }).catch(err => {
        rejects({message: 'Something went wrong', status: false})
      })
    })
  }




}