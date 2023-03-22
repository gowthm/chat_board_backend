import express from 'express'
import mongoose from 'mongoose';
import compression from 'compression'
import cors from 'cors'
import passport from 'passport';
import { MONGODB_URI } from './util/secrets'

import { UserRoutes } from './routes/user.routes'
 import session  from 'express-session';
// import "./middleware/oauth.middleware";

class Server {
  public app: express.Application

  constructor() {
    this.app = express()
    this.config()
    this.routes()
    this.mongo()
  }

  

  public routes(): void {
    this.app.use('/api', new UserRoutes().router)
  }

  public config(): void {
    this.app.set('port', process.env.PORT || 3000)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(compression())
    this.app.use(cors())
    
   // this.app.use(session())

   // this.app.use(express.session({ secret: 'SECRET' })); // session secret
  this.app.use(passport.initialize());
  this.app.use(passport.session());
  this.app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla' 
  }));
  }

  private mongo() {
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('Mongo Connection Established')
    })
    connection.on('reconnected', () => {
      console.log('Mongo Connection Reestablished')
    })
    connection.on('disconnected', () => {
      console.log('Mongo Connection Disconnected')
      console.log('Trying to reconnect to Mongo ...')
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          autoReconnect: true,
          keepAlive: true,
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        })
      }, 3000)
    })
    connection.on('close', () => {
      console.log('Mongo Connection Closed')
    })
    connection.on('error', (error: Error) => {
      console.log('Mongo Connection ERROR: ' + error)
    })

    const run = async () => {
      await mongoose.connect(MONGODB_URI, {
        autoReconnect: true,
        keepAlive: true,
      })
    }
    run().catch((error) => console.error(error))
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('  API is running at http://localhost:%d', this.app.get('port'))
    })
  }
}

const server = new Server()

server.start()
