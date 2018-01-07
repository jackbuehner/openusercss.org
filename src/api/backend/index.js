import {makeExecutableSchema} from 'graphql-tools'
import resolvers from './resolvers'
import typeDefs from './type'

export default makeExecutableSchema({typeDefs, resolvers})
