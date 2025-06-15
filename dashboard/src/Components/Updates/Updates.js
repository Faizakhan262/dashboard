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

  // Doughnut chart data for urban population
  const doughnutChartData = {
    labels: countries,  // The countries will be on the x-axis
    datasets: [
      {
        data:urbanPopData ,  // Calculate percentage of urban population
        backgroundColor: [  '#59a87a','#50986d', '#478861','#315f43', '#1e3929'],  // Different colors for each segment
        borderWidth: 1,
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
          // Set the ticks to be a specific set of values: 0, 2, 4, 6, 8, 10
          callback: function(value) {
            // Since we're manually setting the tick values, this step ensures the proper format
            return value.toLocaleString();
          },
          // Provide the exact tick values
          suggestedMin: 0,  // Set minimum to 0
          suggestedMax: 10,  // Set maximum to 10
          stepSize: 2,  // Control the spacing of ticks (increments of 2)
          // Manually set the tick values
          ticks: {
            values: [0, 2, 4, 6, 8, 10]
          }
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
          <div style={{ width: '300px', height: '290px', marginLeft: 'auto', marginRight: 'auto'}}>
            <h4 style={{ textAlign: 'center', fontSize: '15px', marginTop: "0px", marginBottom: "0px" }}>Migrants Distribution</h4>
            <Line data={lineChartData} options={options} height={500} width={800} />
          </div>
  
          {/* Display the donut chart for urban population */}
          <div style={{ width: '300px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
            <h4 style={{ textAlign: 'center', fontSize: '15px', marginTop: "-15px", marginBottom: "0px" }}>
              Urban Population Distribution
            </h4>
            <Doughnut data={doughnutChartData} options={{ responsive: true }} height={500} width={800} />
          </div>
        </>
      )}
    </div>
  );
  }
   


export default UsersList;
