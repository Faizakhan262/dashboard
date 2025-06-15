import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

// Function to apply styling based on status (if required)
const makeStyle = (status) => {
  if (status === 'Approved') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    };
  } else if (status === 'Pending') {
    return {
      background: '#ffadad8f',
      color: 'red',
    };
  } else {
    return {
      background: '#59bfff',
      color: 'white',
    };
  }
};

export default function BasicTable() {
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error messages

  useEffect(() => {
    // Fetch users from the backend API when the component mounts
    axios.get('http://localhost:5000/api/User')
      .then((response) => {
        // Sort users by population in descending order and take the top 3
        const sortedUsers = response.data.sort((a, b) => {
          const popA = a['Population (2020)'] || 0;
          const popB = b['Population (2020)'] || 0;
          return popB - popA; // Sort descending by population
        }).slice(0, 3); // Get only the top 3 populated countries

        setUsers(sortedUsers); // Store the sorted data
        setLoading(false); // Data fetched, set loading to false
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setError("Failed to load users");  // Set error if fetching fails
        setLoading(false);  // Set loading to false in case of error
      });
  }, []); // Empty dependency array means this will run once on mount

  // If the data is still loading, display loading message
  if (loading) {
    return <div>Loading users...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no users are found, display a message
  if (users.length === 0) {
    return <div>No users data available.</div>;
  }

  return (
    <div className="Table">
    <h3 style={{ marginLeft: '15px' }}>Most Populated Countries</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #5b5b5b29" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell align="left">Population</TableCell>
              <TableCell align="left">Yearly Change</TableCell>
              <TableCell align="left">Net Change</TableCell>
              <TableCell align="left">Land Area (Km²)</TableCell>
              <TableCell align="left">Migrants (net)</TableCell> 
             
              <TableCell align="left">World Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {user['Country (or dependency)']}
                </TableCell>
                <TableCell align="left">
                  {user['Population (2020)'] ? user['Population (2020)'].toLocaleString() : 'Not available'}
                </TableCell>
                <TableCell align="left">{user['Yearly Change']}</TableCell>
                <TableCell align="left">
                  {user['Net Change'] ? user['Net Change'].toLocaleString() : 'Not available'}
                </TableCell>
                <TableCell align="left">
                  {user['Land Area (Km²)'] ? user['Land Area (Km²)'].toLocaleString() : 'Not available'}
                </TableCell>
                <TableCell align="left">
                  {user['Migrants (net)'] !== undefined ? user['Migrants (net)'].toLocaleString() : 'Not available'} {/* Added migrants column data */}
                </TableCell>
                
                <TableCell align="left">{user['World Share']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
