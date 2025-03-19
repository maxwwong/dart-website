import React from 'react';
import styled, { css } from 'styled-components';

const ButtonStyles = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease-in-out;
  border: none;
  outline: none;
  cursor: pointer;
  
  ${props => props.variant === 'primary' && css`
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: var(--secondary-color);
    color: white;
    
    &:hover {
      background-color: var(--secondary-dark);
    }
  `}
  
  ${props => props.variant === 'success' && css`
    background-color: var(--success);
    color: white;
    
    &:hover {
      background-color: #2E7D32;
    }
  `}
  
  ${props => props.variant === 'error' && css`
    background-color: var(--error);
    color: white;
    
    &:hover {
      background-color: #C62828;
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: rgba(30, 136, 229, 0.1);
    }
  `}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.7;
    cursor: not-allowed;
    
    &:hover {
      background-color: ${props.variant === 'primary' ? 'var(--primary-color)' : 
        props.variant === 'secondary' ? 'var(--secondary-color)' : 
        props.variant === 'success' ? 'var(--success)' : 
        props.variant === 'error' ? 'var(--error)' : 'transparent'};
    }
  `}
  
  & > svg {
    margin-right: ${props => props.iconOnly ? '0' : '0.5rem'};
  }
`;

export const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  fullWidth = false,
  disabled = false,
  iconOnly = false,
  ...props 
}) => {
  return (
    <ButtonStyles
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      iconOnly={iconOnly}
      {...props}
    >
      {children}
    </ButtonStyles>
  );
};