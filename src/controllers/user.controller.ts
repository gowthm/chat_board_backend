import { Response } from 'express'
import { UserRepository } from '../repository/user.repository'


export class UserController {
  // Register
  registerUser = async (req: any, res: Response) => {
    await new UserRepository().registerUser(req)
        .then(async (registerUser: any) => {
            if (!registerUser) {
                return res.status(200).send({
                    message: 'Invalid Credentials'
                })
            } else {
                return  res.status(200).send(registerUser);
            }
        })
        .catch((err: any) => {
          return res.status(400).send({
            message: err
          })
    });
  }

  // Login
  authenticateUser = async (req: any, res: Response) => {
    await new UserRepository().authenticateUser(req, res)
        .then(async (authenticateUser: any) => {
            if (!authenticateUser) {
                return res.status(200).send({
                    message: 'Invalid Credentials'
                })
            } else {
                return  res.status(200).send(authenticateUser);
            }
        })
        .catch((err: any) => {
          return res.status(400).send({
            message: err
          })
    });
  }


  // updateUserDetails
  updateUserDetails = async (req: any, res:any) => {
    await new UserRepository().updateUserDetails(req)
        .then(async (updateUserDetails: any) => {
            if (!updateUserDetails) {
              return res.status(401).send({
                message: 'Unauthenticated'
              })
            } else {
                return  res.status(200).send(updateUserDetails);
            }
        })
        .catch((err: any) => {
          return res.status(400).send({
            message: err
          })
    });
  }


  // Refresh token
  refreshToken = async (req: any, res:any) => {
    await new UserRepository().refreshToken(req)
        .then(async (getUserDetails: any) => {
            if (!getUserDetails) {
              return res.status(401).send({
                message: 'Unauthenticated'
              })
            } else {
                return  res.status(200).send(getUserDetails);
            }
        })
        .catch((err: any) => {
          return res.status(400).send({
            message: err
          })
    });
  }


  // Delete user
  deleteUser = async (req: any, res:any) => {
    await new UserRepository().deleteUser(req)
        .then(async (response_data: any) => {
            if (!response_data) {
              return res.status(401).send({
                message: 'Unauthenticated'
              })
            } else {
                return  res.status(200).send(response_data);
            }
        })
        .catch((err: any) => {
          return res.status(400).send({
            message: err
          })
    });
  }
}