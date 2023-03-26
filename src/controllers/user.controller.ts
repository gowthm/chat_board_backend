import { Response } from 'express'
import { User } from '../models/user'
import bcryptjs from 'bcryptjs';
import { Message } from '../models/message';
import { JWT_SECRET, REFRESH_SECRET } from '../util/secrets'
import * as jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/auth.middleware';

export class UserController {

  // Register

  registerUser = async (req: any, res: Response) => {
    return new Promise(async (resolve, rejects) => {
      const phone = req.body.phone;
      await User.findOne({ phone })
        .then(async (userExist:any) => {
          const hashedPassword = await bcryptjs.hash(req.body.password, 12)
          if (userExist) {
            req.body.password = hashedPassword
            const userUpdate = await User.updateOne({ _id: userExist.id }, req.body)
            resolve(res.redirect('/'))
          } else {
            const user = await User.create({
              email: req.body.email,
              password: hashedPassword,
              name: req.body.name,
              phone: req.body.phone,
              age: req.body.age,
            });
            resolve(res.redirect('/'))
          }
        })
    })
  }

  // Login

  authenticateUser = async (req: any, res: Response) => {

    return new Promise(async (resolve, reject) => {
      await User.findOne({ email: req.body.email })
        .then(async (user:any) => {
          const authorized = await bcryptjs.compare(req.body.password, user.password)
          if (!authorized) {
            resolve(res.redirect('/sign_up'))
          } else {
            let messageData: any = await Message.aggregate([
              {
                $lookup: {
                  let: { 'userId': { '$toObjectId': '$user_id' } },
                  from: 'users',
                  pipeline: [
                    {
                      $match: { $expr: { $eq: ['$_id', '$$userId'] } }
                    }
                  ],
                  as: 'userData'
                }
              }
            ]).sort({ created_at: -1 });
            const accessToken = jwt.sign({
              id: user.id
            }, JWT_SECRET, { expiresIn: 60 * 60 });

            const refreshToken = jwt.sign({
              id: user.id
            }, REFRESH_SECRET, { expiresIn: 24 * 60 * 60 })

            res.cookie('accessToken', accessToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
            });

            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              maxAge: 7 * 24 * 60 * 60 * 1000 //equivalent to 7 days
            })
            resolve(
              res.render('message.ejs', { data: messageData, user: user })
            )
          }
        })
        .catch((err:any) => { res.redirect('/sign_up') })
    });
  }

  // Send Message

  messageUpdate = async (req: any, res: Response) => {
    return new Promise(async (resolve, reject) => {
      let cookies: any = {};
      const cookiesArray = req.headers.cookie.split(';');
      cookiesArray.forEach((cookie: any) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
      });

      await authMiddleware(cookies['accessToken']).then(async (userRes) => {
        if (userRes) {
          await Message.create({
            message: req.body.comment,
            user_id: userRes._id,
            created_at: new Date().toLocaleString(),
          })

          let messageData: any = await Message.aggregate([
            {
              $lookup: {
                let: { 'userId': { '$toObjectId': '$user_id' } },
                from: 'users',
                pipeline: [
                  {
                    $match: { $expr: { $eq: ['$_id', '$$userId'] } }
                  }
                ],
                as: 'userData'
              }
            }
          ]).sort({ created_at: -1 });
          res.render('message.ejs', { data: messageData, user: userRes })

        }
      }).catch(err => {
        console.log(err)
      })
    })
  }

  // Get All Message 

  getMessageDetails = async (req: any, res: Response) => {
    return new Promise(async (resolve, rejects) => {

      let cookies: any = {};

      const cookiesArray = req.headers.cookie.split(';');

      cookiesArray.forEach((cookie: any) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
      });

      await authMiddleware(cookies['accessToken']).then(async (userRes) => {

        await Message.aggregate([
          {
            $lookup: {
              let: { 'userId': { '$toObjectId': '$user_id' } },
              from: 'users',
              pipeline: [
                {
                  $match: { $expr: { $eq: ['$_id', '$$userId'] } }
                }
              ],
              as: 'userData'
            }
          }
        ]).sort({ created_at: -1 }).then((resData:any) => {
          res.render('message.ejs', { data: resData, user: userRes })
        }).catch((err:any) => {
          rejects({ message: 'Something went wrong', status: false })
        })
      })
    })
  }
}