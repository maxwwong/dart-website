import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Form, FormInput } from '../components/common/FormComponents';
import { Button } from '../components/common/Button';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--background);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--error);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

export const Login = () => {
  const { currentUser, login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // If already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Dart Tournament</h1>
          <p>Sign in to access your tournament dashboard</p>
        </LoginHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};