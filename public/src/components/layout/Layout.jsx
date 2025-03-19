import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaHistory, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Menu = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-300px'};
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 1000;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
`;

const UserInfo = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--divider);
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  flex: 1;
`;

const MenuItem = styled.li`
  a, button {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    text-decoration: none;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    
    svg {
      margin-right: 0.75rem;
      color: var(--primary-color);
    }
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    &.active {
      background-color: rgba(33, 150, 243, 0.1);
      font-weight: 500;
    }
  }
`;

const MenuFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--divider);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };
  
  return (
    <LayoutContainer>
      <Header>
        <Logo to="/">Dart Tournament</Logo>
        <MenuButton onClick={toggleMenu}>
          <FaBars />
        </MenuButton>
      </Header>
      
      <Overlay isOpen={menuOpen} onClick={closeMenu} />
      
      <Menu isOpen={menuOpen}>
        <MenuHeader>
          <h3>Menu</h3>
          <MenuButton onClick={closeMenu}>
            <FaTimes />
          </MenuButton>
        </MenuHeader>
        
        <UserInfo>
          <h3>{currentUser?.name}</h3>
          <p>{currentUser?.email}</p>
        </UserInfo>
        
        <MenuList>
          <MenuItem>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeMenu}
            >
              <FaHome /> Home
            </Link>
          </MenuItem>
          <MenuItem>
            <Link 
              to="/history" 
              className={location.pathname === '/history' ? 'active' : ''}
              onClick={closeMenu}
            >
              <FaHistory /> Match History
            </Link>
          </MenuItem>
          <MenuItem>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={closeMenu}
            >
              <FaInfoCircle /> About
            </Link>
          </MenuItem>
          
          {currentUser?.isAdmin && (
            <MenuItem>
              <Link 
                to="/admin" 
                className={location.pathname.startsWith('/admin') ? 'active' : ''}
                onClick={closeMenu}
              >
                <FaShieldAlt /> Admin Dashboard
              </Link>
            </MenuItem>
          )}
        </MenuList>
        
        <MenuFooter>
          <MenuItem>
            <button onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </MenuItem>
        </MenuFooter>
      </Menu>
      
      <Main>{children}</Main>
    </LayoutContainer>
  );
};