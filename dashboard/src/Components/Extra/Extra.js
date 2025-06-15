import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart.js elements
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrantsData, setMigrantsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [urbanPopData, setUrbanPopData] = useState([]);
  const [totalPopData, setTotalPopData] = useState([]);

  useEffect(() => {
    // Fetch users from your back-end API
    axios.get('http://localhost:5000/api/User')
      .then((response) => {
        console.log(response.data);  // Log the response to check its structure
        const sortedUsers = response.data
          .sort((a, b) => b['Population (2020)'] - a['Population (2020)']) // Sort by population in descending order
          .slice(0, 12);  // Get the top 12 countries
        setUsers(sortedUsers);  // Save sorted data in state
        setLoading(false);  // Set loading to false once data is fetched

        // Extract data for charts
        const migrantData = sortedUsers.map(user => user['Migrants (net)']);
        const countryNames = sortedUsers.map(user => user['Country (or dependency)']);
        setMigrantsData(migrantData);
        setCountries(countryNames);

        // Extract urban and total population data for the donut chart
        const urbanPopPercentages = sortedUsers.map(user => {
          return parseFloat(user['Urban Pop %'].replace('%', '').trim());
        });
        const totalPop = sortedUsers.map(user => user['Population (2020)']);
        setUrbanPopData(urbanPopPercentages);
        setTotalPopData(totalPop);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginLeft: '50px' }}>Top 12 Countries by Population</h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>  // Show loading message while data is being fetched
      ) : (
        <>
          <div style={{ display: 'flex' }}>
            {/* Display the Table */}
            <div style={{ marginLeft: '30px', overflowX: 'auto' }}>
              <table border="1" cellPadding="10" cellSpacing="0" style={tableStyle}>
                <thead>
                  <tr style={tableHeaderStyle}>
                    <th>Country</th>
                    <th>Population</th>
                    <th>Yearly Change</th>
                    <th>Net Change</th>
                    <th>Migrants</th>
                    <th>Land Area (Km²)</th>
                    <th>Urban Pop %</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="7">No users found.</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} style={userRowStyle}>
                        <td>{user['Country (or dependency)']}</td>
                        <td>{user['Population (2020)'] ? user['Population (2020)'].toLocaleString() : 'Not available'}</td>
                        <td>{user['Yearly Change']}</td>
                        <td>{user['Net Change'] ? user['Net Change'].toLocaleString() : 'Not available'}</td>
                        <td>{user['Migrants (net)'] ? user['Migrants (net)'].toLocaleString() : 'Not available'}</td>
                        <td>{user['Land Area (Km²)'] ? user['Land Area (Km²)'].toLocaleString() : 'Not available'}</td>
                        <td>{user['Urban Pop %'] ? user['Urban Pop %'] : 'Not available'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Table header style
const tableHeaderStyle = {
  backgroundColor: '#6AB187',  // Light green color for header
  color: 'white',  // White text color for better contrast
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
};

// Table row style for alternating row colors
const userRowStyle = {
  backgroundColor: '#f9f9f9',  // Light gray for normal rows
};

const tableStyle = {
  width: '900px',
  borderCollapse: 'collapse',
  marginBottom: '30px',
  fontSize: '16px',
  textAlign: 'center',
  border: '1px solid #ddd',  // Light border around the table
  borderRadius: '8px',  // Rounded corners for the table
};

// Add hover effect for rows
const hoverStyle = {
  backgroundColor: '#e1f5d5',  // Light green hover effect
};

export default UsersList;
