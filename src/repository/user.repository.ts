import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { JWT_SECRET, REFRESH_SECRET } from '../util/secrets'
import otpGenerator from 'otp-generator';
import crypto from 'crypto';

export class UserRepository {

  registerUser = async (req: any) => {
    return new Promise(async (resolve, reject) => {
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
            height: req.body.height, 
            weight: req.body.weight, 
            bmi: req.body.bmi, 
            allergies: req.body.allergies, 
            food_preferences: req.body.food_preferences, 
            role_name: req.body.role_name,
            account_status: req.body.account_status,
            sensors_synced: req.body.sensors_synced,
            gender: req.body.gender
          });
          resolve({message: "User created successfully", status:true  })
        }
      })
      .catch((err) => reject({ message: "Something went wrong", status:false  }));
    });
  }
 
  authenticateUser = async (req: any, res:any) => {
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
            refreshToken:refreshToken,
            message: 'Login Successfully',
            status:true
        })
        }
      })
      .catch((err) => reject({ message: "Invalid Credentials", status:false  }));  
      
    });
  }

  refreshToken = async (req: any) => {
    return new Promise(async (resolve, reject) => {
      const email = req.body.email;
      const refreshToken = req.body.refreshToken;
      const secretKey: string = JWT_SECRET;
      const refreshsecretKey: string = REFRESH_SECRET;
      if(req.body.refreshToken) {
      // Verifying refresh token
        jwt.verify(refreshToken, refreshsecretKey, (error: any) => {
          if (error) {
            // Wrong Refesh Token
            reject({ message: "Wrong Refesh Token", status: false });
          }
          else {
            // Correct token we send a new access token
            const accessToken = jwt.sign({ "email": email }, secretKey, { expiresIn: 60 * 60});
            resolve({ access_token: accessToken, status: 'Access token created successfully' });
          }
        })
      } else {
          resolve({ message: 'Unauthorized refreshToken', status: false });
      }
      
    });
  }

  //Update profile details
  updateUserDetails = async (req: any) => {
    return new Promise(async (resolve, reject) => {
      await User.updateOne({_id:req.params.id},req.body)
          .then((results) => {
              resolve({ message: "User updated successfully", status:true  })
          }
      )
      .catch((err) => reject({ message: "Something went wrong", status:false  }));
      });
  }

  deleteUser = async (req: any) => {
    return new Promise(async (resolve, reject) => {
      const user = await User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (user === null) {
          resolve({ message: "User not found", status:false  });
        } else {
          resolve({ message: 'User Deleted Successfully', status:true })
        }
      })
      .catch((err) => {
        reject({ message: "Something went wrong", status:false  })
      });
    });
  }

}
