import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios"; // Import axios to fetch data
import "./Card.css";

const CompactCard = ({ param, currentMetric, setExpanded }) => {
  // Determine the metric to display dynamically
  let label = "";
  let value = "";
  let unit = "";

  switch (currentMetric) {
    case "density":
      label = "Population Density";
      value = param.density;
      unit = "P/Km²";
      break;
    case "fert":
      label = "Fertility Rate";
      value = param.fertilityRate;
      unit = "%";
      break;
    case "med":
      label = "Murder Rate";
      value = param.murderRate;
      unit = "%";
      break;
    default:
      label = "Population Density";
      value = param.density;
      unit = "P/Km²";
  }

  return (
    <motion.div
      className="CompactCard"
      style={{
        background: "#4e73df", // Customize this based on your design
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Customize shadow
      }}
      layoutId="expandableCard"
      onClick={setExpanded} // Trigger the expanded state when clicked
    >
      <div className="radialBar">
        <CircularProgressbar
          value={value} // Display the current metric value
          text={`${value} ${unit}`} // Show the value with its unit inside the bar
        />
        <span>{label}</span>
      </div>
      <div className="detail">
        <span>For Top 5 Countries</span>
        <span>{value} {unit}</span> {/* Show the value of the current metric */}
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
};

const Card = () => {
  const [userData, setUserData] = useState(null); // Store the fetched data
  const [isExpanded, setIsExpanded] = useState(false); // Track if the card is expanded
  const [currentMetric, setCurrentMetric] = useState("density"); // Track the currently displayed metric (density, fert, or med)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded); // Toggle expanded state
  };

  const changeMetric = (metric) => {
    setCurrentMetric(metric); // Change the displayed metric (density, fert, or med)
  };

  useEffect(() => {
    // Fetch data from your backend API
    axios
      .get("http://localhost:5000/api/User") // Replace with your API endpoint
      .then((response) => {
        const countries = response.data.slice(0, 5); // Get data for the first 5 countries

        // Calculate the population density, fertility rate, and murder rate for each country and aggregate the data
        const countriesWithData = countries.map((country) => {
          const population = country["Population (2020)"];
          const landArea = country["Land Area (Km²)"];
          const density = (population / landArea).toFixed(2); // Calculate population density
          const fertilityRate = parseFloat(country["Fertility Rate (%)"]) || 0;
          const murderRate = parseFloat(country["Murder Rate (%)"]) || 0;

          return {
            country: country["Country (or dependency)"],
            density: parseFloat(density),
            fertilityRate,
            murderRate,
          };
        });

        // Calculate the average values for each metric across the first 5 countries
        const totalDensity = countriesWithData.reduce(
          (acc, country) => acc + country.density,
          0
        );
        const averageDensity = (totalDensity / countriesWithData.length).toFixed(2);

        const totalFertility = countriesWithData.reduce(
          (acc, country) => acc + country.fertilityRate,
          0
        );
        const averageFertility = (totalFertility / countriesWithData.length).toFixed(2);

        const totalMurder = countriesWithData.reduce(
          (acc, country) => acc + country.murderRate,
          0
        );
        const averageMurder = (totalMurder / countriesWithData.length).toFixed(2);

        // Store the aggregated data in the state
        setUserData({
          density: averageDensity,
          fertilityRate: averageFertility,
          murderRate: averageMurder,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, []);

  return (
    <div className="Card" onClick={toggleExpanded}>
      {userData ? (
        <>
          <CompactCard
            param={userData}
            currentMetric={currentMetric}
            setExpanded={toggleExpanded} // Pass toggle function for expansion
          />
          {/* Toggle between metrics */}
          <div className="metricButtons">
            <button onClick={() => changeMetric("density")}>Density</button>
            <button onClick={() => changeMetric("fert")}>Fertility Rate</button>
            <button onClick={() => changeMetric("med")}>Murder Rate</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Card;
