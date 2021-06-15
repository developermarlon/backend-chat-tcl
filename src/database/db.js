import MongoClient from 'mongodb'

const connect = async () => {
    try {
        const client = await MongoClient.connect('mongodb+srv://root:palmeramarketing@tcl.8pgsv.mongodb.net/test', {useUnifiedTopology: true, useNewUrlParser: true})
        const db = await client.db('node-restapi')
        return db
    }catch(error) {
        console.log(error)
    }
    
}

export default connect

