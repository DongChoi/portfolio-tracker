import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import './App.css';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import NavBar from './components/NavBar';

const httpLink = createHttpLink({
  uri: 'graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    ...headers,
    authorization: token ? `Bearer ${token}` : ''
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
   <ApolloProvider client={client}>
    <Router>
      <>
        <NavBar />
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />} />
        </Routes>
      </>
    </Router>
   </ApolloProvider>
  );
}

export default App;
