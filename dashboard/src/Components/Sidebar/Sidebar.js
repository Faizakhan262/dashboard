import React from 'react';
import { SidebarData } from '../Data/Data.js';
import './Sidebar.css'; 
import { FaUsers } from 'react-icons/fa';  // Import the 'People' icon from React Icons
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {

  const navigate = useNavigate(); 
  const handleMenuItemClick = (path) => {
    navigate(path); // Navigate to the provided path
  };
  return ( 
    <div className='Sidebar'>
      <div className='logo'>
        {/* Using the 'FaUsers' icon instead of the image */}
        <FaUsers className="people-icon" />
        <span>
            pe<span>O</span>ple<span>.</span>
          </span>
      </div>
      <div className='menu'>
        {SidebarData.map((item, index) => (
          <div 
            className='menuItem' 
            key={index} 
            onClick={() => handleMenuItemClick(item.path)} // Navigate on click
          >
            {item.icon}
            <span className='menuItem-heading'>{item.heading}</span>
          </div>
        ))}
      </div>
    </div>
  ); 
};

export default Sidebar;
