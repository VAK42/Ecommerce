import { mockDataProvider } from '../data/mockData'
import fastifyApollo from '@as-integrations/fastify'
import { ApolloServer } from '@apollo/server'
import Fastify from 'fastify'
const data = new mockDataProvider()
const typeDefs = `type Product{id:Int title:String price:Float stock:Int category:String rating:Float}type Query{products(limit:Int):[Product]product(id:Int):Product}`
const resolvers = {
  Query: {
    products: (_, { limit }) => data.products.slice(0, limit || 20),
    product: (_, { id }) => data.products.find((p: any) => p.id == id),
  },
}
async function start() {
  const server = new ApolloServer({ typeDefs, resolvers })
  const app = Fastify()
  await server.start()
  await app.register(fastifyApollo(server))
  await app.listen({ port: 4000, host: '0.0.0.0' })
}
start()