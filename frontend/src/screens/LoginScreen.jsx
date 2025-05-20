import React, { useState } from 'react';
import { TextField } from '@mui/material';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div>
      <TextField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
    </div>
  );
};

export default LoginScreen; 