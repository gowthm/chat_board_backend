import express from 'express'
import mongoose from 'mongoose';
import compression from 'compression'
import cors from 'cors'
import { MONGODB_URI } from './util/secrets'
import { UserRoutes } from './routes/user.routes'
import path from 'path'

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
    this.app.get('/', function(req, res) {
      res.render('login.ejs', {root: __dirname})
    })
    this.app.get('/sign_up', function(req, res) {
      res.render('signup.ejs', {root: __dirname})
    })

    this.app.get('/message', function(req, res) {
      res.render('message.ejs', {root: __dirname})
    })
  }

  public config(): void {
    this.app.set('port', process.env.PORT || 3000)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(compression())
    this.app.use(cors())
    this.app.set('views', path.join(__dirname))
    this.app.set('view engine', 'ejs');

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
        mongoose.connect(MONGODB_URI)
      }, 3000)
    })
    connection.on('close', () => {
      console.log('Mongo Connection Closed')
    })
    connection.on('error', (error: Error) => {
      console.log('Mongo Connection ERROR: ' + error)
    })

    const run = async () => {
      await mongoose.connect(MONGODB_URI)
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
