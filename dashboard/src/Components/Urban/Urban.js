import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
          .slice(0, 5);  // Get the top 5 countries
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

  // Doughnut chart data for urban population
  const doughnutChartData = {
    labels: countries,  // The countries will be on the x-axis
    datasets: [
      {
        data: urbanPopData,  // Calculate percentage of urban population
        backgroundColor: ['#59a87a','#50986d', '#478861','#315f43', '#1e3929'],  // Different colors for each segment
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: "white", width: '100%', height: '100vh' }}>
      <h3 style={{fontSize: '24px', marginLeft: "50px"}}>
          Urban Population Distribution
      </h3>

      <div style={{ width: '40%', marginTop: "100px", marginRight: "120px", backgroundColor: 'white' }}>
        {loading ? (
          <p>Loading...</p>  // Show loading message while data is being fetched
        ) : (
          <Doughnut data={doughnutChartData} options={{ responsive: true }} height={900} width={1200} />
        )}
      </div>

      <div style={{ width: '60%', paddingRight: '20px', marginLeft: "47px", marginTop: "120px", backgroundColor: 'white' }}>
        {/* Table to show additional information */}
        <table style={{ width: '300px', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f0f0f0' }}>Country</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f0f0f0' }}>Urban Population (%)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#ffffff' }}>
                  {user['Country (or dependency)']}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#ffffff' }}>
                  {user['Urban Pop %']}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
