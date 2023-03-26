import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { JWT_SECRET } from '../util/secrets'

const authMiddleware = async (token: any) => {
  let userData:any;
  try {
    const Authorization = token;
    if (Authorization) {
      const userTokenData: any = jwt.verify(Authorization, JWT_SECRET);
      await getUserDetails(userTokenData).then((userDetails) => {
        userData =  userDetails;
      }).catch((err) => {
        userData = 'User Not Found'
      })  
    } else {
      userData =  'Authentication token missing'
    }
  } 
  catch (error) {
    userData = 'Wrong authentication token'
  }
  return userData;
};

const getUserDetails = async (payload: any) => {
  return new Promise(async (resolve, reject) => {
      await User.findOne({ _id: payload.id })
          .then((results) => {
              resolve(results)
          }
      )
      .catch((err) => reject(err));
      });
}

export default authMiddleware;