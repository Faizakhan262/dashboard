import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios to make the API request
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

const Card = () => {
  const [isExpanded, setIsExpanded] = useState(null); // Track which card is expanded (null = no card expanded)
  const [userData, setUserData] = useState(null); // State to store data for the first 5 countries

  const toggleExpanded = (type) => {
    setIsExpanded(isExpanded === type ? null : type); // Toggle expanded card
  };

  useEffect(() => {
    // Fetch user data for the first 5 countries
    axios
      .get("http://localhost:5000/api/User") // Replace with your API endpoint
      .then((response) => {
        console.log("API Response:", response.data); // Log the response to check the structure

        // Get the first 5 countries from the API response
        const countries = response.data.slice(0, 5);

        // Ensure the data contains required fields and calculate density/fertility rate/merd/med
        const countriesWithData = countries.map((country) => {
          const population = parseFloat(country["Population (2020)"]);
          const landArea = parseFloat(country["Land Area (Km²)"]);

          // Access fertility rate, murder rate (merd), and urban population (med) within the respective objects
          let fertilityRate = parseFloat(country.Fert[" Rate"]);
          let merdRate = parseFloat(country.Med[" Age"]);

          // If any rate is invalid, fallback to 0
          if (isNaN(fertilityRate)) fertilityRate = 0;
          if (isNaN(merdRate)) merdRate = 0;

          // Calculate population density
          const density = population / landArea;

          return {
            ...country,
            density: density.toFixed(2),
            fertilityRate: fertilityRate.toFixed(2),
            merdRate: merdRate.toFixed(2),
          };
        }).filter(country => country !== null); // Remove any invalid countries

      
        const totalDensity = countriesWithData.reduce((acc, country) => acc + parseFloat(country.density), 0);
        console.log("totalDensity",totalDensity)
        const averageDensity = (totalDensity / countriesWithData.length).toFixed(2);
         console.log("averageDensity",averageDensity)
        const totalFertility = countriesWithData.reduce((acc, country) => acc + parseFloat(country.fertilityRate), 0);
        console.log("totalFertility",totalFertility)
        const averageFertility = (totalFertility / countriesWithData.length).toFixed(2);

        const totalMurder = countriesWithData.reduce((acc, country) => acc + parseFloat(country.merdRate), 0);
        const averageMed = (totalMurder / countriesWithData.length).toFixed(2);

        // Store the aggregated data in state
        setUserData({
          averageDensity, // Show average density for all countries
          averageFertility, // Show average fertility rate for all countries
          averageMed, // Show average murder rate for all countries
          countriesWithData, // Store data for the 5 countries
        });
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, []);

  return (
    <div className="Card">
      {userData ? (
        <>
          <CompactCard type="density" param={userData} onClick={() => toggleExpanded("density")} />
          <CompactCard type="fertility" param={userData} onClick={() => toggleExpanded("fertility")} />
          <CompactCard type="merd" param={userData} onClick={() => toggleExpanded("merd")} />
        </>
      ) : (
        <p>Loading...</p>
      )}

      <AnimatePresence>
        {isExpanded === "density" && <ExpandedDensityCard data={userData} setIsExpanded={setIsExpanded} />}
        {isExpanded === "fertility" && <ExpandedFertilityCard data={userData} setIsExpanded={setIsExpanded} />}
        {isExpanded === "merd" && <ExpandedMerdCard data={userData} setIsExpanded={setIsExpanded} />}
      </AnimatePresence>
    </div>
  );
};

const CompactCard = ({ type, param, onClick }) => {
  let label = "";
  let value = "";
  let progressBarValue = 0;
  let backgroundColor = '';
  let highestDensity = 0;
  let highestFert = 0;
  let highestMerd = 0;

  // Calculate highest values
  if (type === "density") {
    label = "Population Density";
    backgroundColor = "#B3C100"; // Background for density card
    value = param.averageDensity;
    progressBarValue = parseFloat(param.averageDensity);
    
    // Find the country with the highest population density
    highestDensity = Math.max(...param.countriesWithData.map(country => parseFloat(country.density)));
  } else if (type === "fertility") {
    label = "Fertility Rate";
    value = param.averageFertility;
    backgroundColor = "#242d49"; // Background for fertility card
    progressBarValue = parseFloat(param.averageFertility);

    // Find the country with the highest fertility rate
    highestFert = Math.max(...param.countriesWithData.map(country => parseFloat(country.fertilityRate)));
  } else if (type === "merd") {
    label = "Median Age";
    value = param.averageMed;
    backgroundColor = "#788097"; // Background for murder rate card
    progressBarValue = parseFloat(param.averageMed);

    // Find the country with the highest murder rate
    highestMerd = Math.max(...param.countriesWithData.map(country => parseFloat(country.merdRate)));
  }

  return (
    <motion.div
      className="CompactCard"
      style={{
        background: backgroundColor, // Customize background color if needed
        color: "white",
        display: 'flex', // Using flexbox
        alignItems: 'center', // Vertically center the content
        justifyContent: 'space-between', // Distribute space between items
        padding: '10px', // Adjust padding for spacing
        borderRadius: '8px', // Optional: rounded corners
      }}
      onClick={onClick} // Handle click to toggle expanded view
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {/* Display the label on top-left */}
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {label}
        </div>
        
        {/* Display the highest value based on the card type */}
        <div style={{ fontWeight: 'bold', fontSize: '22px', marginTop: '25px', marginLeft: '-28px' }}>
          {type === "density" ? `${highestDensity} P/Km²` :
           type === "fertility" ? `${highestFert} %` :
           `${highestMerd} yr `}
        </div>
      </div>

      <CircularProgressbar
        value={progressBarValue}
        text={`${value}`}
        styles={{
          text: {
            fill: 'white',
            fontWeight: 'bold', // Making the progress bar text bold
          },
        }}
      />
    </motion.div>
  );
};


// ExpandedCard for Population Density
const ExpandedDensityCard = ({ data, setIsExpanded }) => {
  const densityChartData = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      xaxis: {
        categories: data.countriesWithData.map((country) => country["Country (or dependency)"]),
      },
    },
    series: [
      {
        name: "Population Density (P/Km²)",
        data: data.countriesWithData.map((country) => parseFloat(country.density)),
      },
    ],
  };

  // Close button handler
  const handleClose = () => {
    console.log("Close clicked for Density Card");
    setIsExpanded(null); // Close the expanded card
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: "#B3C100",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={handleClose} /> {/* This should trigger close */}
      </div>
      <span>Population Density of Top 5 Countries</span>
     
      <div className="chartContainer">
        <Chart options={densityChartData.options} series={densityChartData.series} type="area" />
      </div>
    </motion.div>
  );
};

// ExpandedCard for Fertility Rate
const ExpandedFertilityCard = ({ data, setIsExpanded }) => {
  const fertilityChartData = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      xaxis: {
        categories: data.countriesWithData.map((country) => country["Country (or dependency)"]),
      },
    },
    series: [
      {
        name: "Fertility Rate (%)",
        data: data.countriesWithData.map((country) => parseFloat(country.fertilityRate)),
      },
    ],
  };

  // Close button handler
  const handleClose = () => {
    console.log("Close clicked for Fertility Card");
    setIsExpanded(null); // Close the expanded card
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: "#242d49",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={handleClose} /> {/* This should trigger close */}
      </div>
      <span>Fertility Rate of Top 5 Countries</span>
      <div className="chartContainer">
        <Chart options={fertilityChartData.options} series={fertilityChartData.series} type="area" />
      </div>
    </motion.div>
  );
};

// ExpandedCard for Murder Rate
const ExpandedMerdCard = ({ data, setIsExpanded }) => {
  const merdChartData = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      xaxis: {
        categories: data.countriesWithData.map((country) => country["Country (or dependency)"]),
      },
    },
    series: [
      {
        name: "Median Age",
        data: data.countriesWithData.map((country) => parseFloat(country.merdRate)),
      },
    ],
  };

  // Close button handler
  const handleClose = () => {
    console.log("Close clicked for Murder Rate Card");
    setIsExpanded(null); // Close the expanded card
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: "#788097",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={handleClose} />
      </div>
      <span>Median Ages</span>
      <div className="chartContainer">
        <Chart options={merdChartData.options} series={merdChartData.series} type="area" />
      </div>
    </motion.div>
  );
};

export default Card;
