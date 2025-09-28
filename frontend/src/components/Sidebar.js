import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    padding: 10px 0;
  }
`;

const Logo = styled.div`
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  p {
    margin: 5px 0 0 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 5px 0;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  border-radius: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Kur\'an Hatmi', icon: '📖' },
    { path: '/cevsen', label: 'Cevşen Hatmi', icon: '📿' },
    { path: '/virdler', label: 'Virdler', icon: '🕌' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <SidebarContainer>
      <Logo>
        <h1>Hatim & Vird</h1>
        <p>Dijital Hatim Uygulaması</p>
      </Logo>
      
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.path}>
            <MenuButton
              active={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
            >
              <span style={{ marginRight: '10px' }}>{item.icon}</span>
              {item.label}
            </MenuButton>
          </MenuItem>
        ))}
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
