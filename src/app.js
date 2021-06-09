//import packages
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import moment from 'moment-timezone'

//settings
const app = express()
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
})
moment().locale('es').tz("America/Bogota").format()

//middlewares
app.use(morgan('dev'))
app.use(express.json());
app.use(cors())

//public folder
app.use(express.static(__dirname + '/public'))


// export default app express
export default app