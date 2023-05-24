// stockdata.org app token = RamgPwgAcspYJX9SidkgGi2vtsrXoKmM2115G1fr

// this is where we go when a user logs in / signs up
// will include:
    // form for user to add a new position
    // table of all user positions
    // etc.

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { REMOVE_POSITION } from '../utils/mutations';
import { SAVE_POSITION } from '../utils/mutations';
import Auth from '../utils/auth';

const Dashboard = () => {
    const { loading, data } = useQuery(QUERY_USER);
    const [removePosition, { error }] = useMutation(REMOVE_POSITION);
    const [savePosition, { error }] = useMutation(SAVE_POSITION);
    const [userFormInput, setUserFormInput] = useState({
        purchaseDate: '',
        purchasePrice: 0.00,
        symbol: ''
    });

    const userData = data?.user || {};

    const handleRemovePosition = async (positionId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null
        if(!token) {
            return false
        };

        try {
            const { data } = await removePosition({
                variables: { positionId }
            });
        } catch (e) {
            console.error(e)
        }
    };

    // const handleSavePosition = async ({ ...userFormInput }) => {
      
    // }

    if (loading) {
        return <h2>LOADING...</h2>
    }

  return (
    <div>
      
    </div>
  )
}

export default Dashboard
