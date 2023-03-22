
require('dotenv').config()
export const MONGODB_URI = 'mongodb://127.0.0.1:27017/metapowerapp_dev'

console.log(MONGODB_URI, '==========')
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
