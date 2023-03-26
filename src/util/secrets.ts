
require('dotenv').config()
export const MONGODB_URI = 'mongodb+srv://gowtham:qs1D8eniGvovSr6j@cluster0.cvlnl3b.mongodb.net/chatapp'

console.log(MONGODB_URI, '=========')
if (!MONGODB_URI) {
  console.log('No mongo connection string. Set MONGODB_URI environment variable.')
  process.exit(1)
}

export const JWT_SECRET = process.env['JWT_SECRET']

if (!JWT_SECRET) {
  console.log('No JWT secret string. Set JWT_SECRET environment variable.')
  process.exit(1)
}

export const REFRESH_SECRET = process.env['REFRESH_SECRET']

if (!REFRESH_SECRET) {
  console.log('No JWT secret string. Set REFRESH_SECRET environment variable.')
  process.exit(1)
}
