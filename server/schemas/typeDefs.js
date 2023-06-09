const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    user: User
  }

  type User {
    _id: ID!
    username: String
    email: String!
    bookCount: Int
    savedBooks: [Book]!
  }
  
  type Book {
    bookId:ID!
    authors: [String]
    description:String
    title:String
    image:String
    link:String
  }

  input BookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: String!
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookInput: BookInput!): User
    removeBook(bookId: String): User
  }
`;

module.exports = typeDefs;