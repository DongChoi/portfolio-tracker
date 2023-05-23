//start with typeDefs and then resolvers as resolvers are the controllers of what queries do
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers }