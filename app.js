const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const port = process.env.port || 8000;

mongoose.connect('mongodb://localhost:27017/neoneopets', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const User = mongoose.model('User', userSchema);
 
const schema = buildSchema(`
  type Query {
    getUser(username: String!): User
    getUsers: [User]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String): User
  }

  type User {
    username: String!
    password: String
    email: String
  }
`);

const root = {
  getUser: async (username) => await User.findOne(username).exec(),
  getUsers: async () => await User.find({}).exec(),
  addUser: async (username) => await User.create(username)
};
 
app.get('/', (req, res) => {
  res.send(root);
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})