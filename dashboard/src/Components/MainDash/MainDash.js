import React from "react";
import Cards from "../Cards/Cards.js";
import Table from "../Table/Table.js";
import "./MainDash.css";

const MainDash = () => {
  return (
    <div className="MainDash">
      <h2>POPULATION <span>BREAKDOWN</span></h2>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDash;
