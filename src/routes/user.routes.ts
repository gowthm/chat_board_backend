import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import authMiddleware from '../middleware/auth.middleware'

export class UserRoutes {
  router: Router
  public userController: UserController = new UserController()

  constructor() {
    this.router = Router()
    this.routes()
  }
  routes() {
    this.router.post('/register', this.userController.registerUser)
    this.router.post('/login', this.userController.authenticateUser)
    this.router.post('/refreshtoken', this.userController.refreshToken)
    this.router.put('/updateuser/:id', authMiddleware, this.userController.updateUserDetails)
    this.router.delete(`/user/:id`, authMiddleware, this.userController.deleteUser);
  }
}
