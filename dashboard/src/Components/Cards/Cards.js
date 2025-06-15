import React from "react";
import "./Cards.css";
import { cardsData } from "../Data/Data.js";
import Card from "../Card/Card.js";  // Ensure this path is correct

const Cards = () => {
  return (
    <div className="Cards">
     
        <div className="parentContainer">
          <Card
            title={cardsData.title}
            color={cardsData.color}
            barValue={cardsData.barValue}
            value={cardsData.value}
            png={cardsData.png}
            series={cardsData.series}
          />
        </div>
    
    </div>
  );
};

export default Cards;



