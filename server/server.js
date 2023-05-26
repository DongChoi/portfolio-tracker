
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, 
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if(process.env.NODE_ENV === 'production') {
    // app.use(express.static(path.join(__dirname, 'portfolio-tracker/build')))
    app.use(express.static('portfolio-tracker/build'))
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../portfolio-tracker/'))
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../portfolio-tracker/build/index.html'));
});

const startApolloServer = async () => {
    await server.start();
    server.applyMiddleware({ app });
    
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on PORT ${PORT}`);
            console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`)
        })
    })
}

startApolloServer()
