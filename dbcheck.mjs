import { MongoClient } from "mongodb"

const uri = "mongodb+srv://rentalAdmin:arQOt1FQz3l2iUT4@cluster0.ciwub8g.mongodb.net/rentalAdmindb"
const client = new MongoClient(uri)
await client.connect()
await client.close()
