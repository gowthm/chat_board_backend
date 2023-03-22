import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { JWT_SECRET } from '../util/secrets'

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    if (Authorization) {
      const userTokenData: any = jwt.verify(Authorization, JWT_SECRET);
      await getUserDetails(userTokenData).then((userDetails) => {
        if (userDetails) {
            req.user = userDetails;
            next();
          } else {
            next(HttpException(res, 400, 'Invalid Credentials'));
          }
      }).catch((err) => {
        next(HttpException(res, 500, err));
      })  
    } else {
      next(HttpException(res, 404, 'Authentication token missing'));
    }
  } 
  catch (error) {
    console.log("error error",error)
    next(HttpException(res, 401, 'Wrong authentication token'));
  }
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

const HttpException = (res:any, status_code:any, msg:any) => {
  return res.status(status_code).send({
    message: msg
  })
}

export default authMiddleware;