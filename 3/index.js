import express from "express"
import { ApolloServer, gql } from "apollo-server-express"
import cors from "cors"
import http from "http"
import dotenv from "dotenv"
dotenv.config()

const app = express()


app.use(express.json())
app.use(cors())



const typeDefs = `
  type Query{
    greetings:String
  }
`

const resolvers = {}


let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);



app.get("/", (req, res) => {
    res.send("dsfdsf")
})

const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
    console.log("port", apolloServer.graphqlPath)
})

