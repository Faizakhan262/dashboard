import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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
          .slice(0, 5);  // Get the top 4 countries
        setUsers(sortedUsers);  // Save sorted data in state
        setLoading(false);  // Set loading to false once data is fetched

        // Extract data for charts
        const migrantData = sortedUsers.map(user => user['Migrants (net)']);
        const countryNames = sortedUsers.map(user => user['Country (or dependency)']);
        setMigrantsData(migrantData);
        setCountries(countryNames);

        // Extract urban and total population data for the donut chart
        const urbanPopPercentages = sortedUsers.map(user => {
          // Parse the 'Urban Pop %' field to remove "%" and convert to a number
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

  // Line chart data
  const lineChartData = {
    labels: countries,  // The countries will be on the x-axis
    datasets: [
      {
        label: 'Migrants (Net)',
        data: migrantsData,  // Migrant data
        borderColor: '#242d49',  // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Fill color under the line
        borderWidth: 3,
        pointBackgroundColor: '#1e39291',  // Color of the points
        pointBorderColor: '#1e3929',  // Border color of the points
        pointRadius: 5,  // Size of the points
        pointHoverRadius: 7,  // Hover radius of the points
        tension: 0.4,  // Line smoothing
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        backgroundColor: '#242d49',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        callbacks: {
          label: (tooltipItem) => {
            const migrant = tooltipItem.raw;
            return `Migrants (Net): ${migrant < 0 ? '-' : '+'}${Math.abs(migrant).toLocaleString()}`;  // Absolute value format
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Migrants (Net)',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    maintainAspectRatio: false, // Disable maintaining aspect ratio
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    elements: {
      line: {
        tension: 0.3,  // Smoothing for the line
      },
    },
  };
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}></h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>  // Show loading message while data is being fetched
      ) : (
        <>
          {/* Display the line chart */}
          <div style={{ width: '900px', height: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1 style={{ textAlign: 'center', fontSize: '32px', marginTop: "0px", marginBottom: "0px" }}>Migrants Distribution</h1>
            <Line data={lineChartData} options={options} height={500} width={800} />
          </div>

          {/* Display the table of migrants and countries below the line chart */}
          <div style={{ marginTop: '30px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          
            <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <thead>
                <tr style={{ backgroundColor: '#242d49', color: 'white', fontSize: '16px' }}>
                  <th style={{ padding: '12px 20px', border: '1px solid #ddd', textAlign: 'left' }}>Country</th>
                  <th style={{ padding: '12px 20px', border: '1px solid #ddd', textAlign: 'left' }}>Migrants (Net)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff' }}>
                    <td style={{ padding: '12px 20px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'left' }}>
                      {user['Country (or dependency)']}
                    </td>
                    <td style={{ padding: '12px 20px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'left' }}>
                      {user['Migrants (net)'] < 0 ? '-' : '+'}{Math.abs(user['Migrants (net)']).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersList;
