import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: ${props => props.padding || '1.5rem'};
  margin-bottom: ${props => props.marginBottom || '1.5rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: var(--text-primary);
`;

export const Card = ({ 
  children, 
  title, 
  padding,
  marginBottom,
  fullWidth = false,
  ...props 
}) => {
  return (
    <CardContainer 
      padding={padding} 
      marginBottom={marginBottom} 
      fullWidth={fullWidth}
      {...props}
    >
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </CardContainer>
  );
};