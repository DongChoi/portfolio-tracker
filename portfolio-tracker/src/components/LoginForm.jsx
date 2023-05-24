import React, { useState, useEffect } from 'react';
// import form dependencies from mui
import TextField from '@mui/material/TextField'
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth'

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ username: '', password: ''});
    const [validated] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

    const [login, { error }] = useMutation(LOGIN_USER)

    useEffect(() => {
        if(error) {
            setShowAlert(true)
        } else {
            setShowAlert(false)
        }
    }, [error])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value})
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await login({
                variables: { ...userFormData } 
            });
            console.log(data)
            Auth.login(data.login.token)
        } catch (e) {
            console.error(e)
        }

        setUserFormData({
            username: '',
            email: ''
        });
    };

  return (
    <div>
      
    </div>
  )
}

export default LoginForm
