/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HeroCard.css";
import { saveHeroesToDB, getHeroesFromDB } from "../db";

const HeroCard = () => {
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const offlineHeroes = await getHeroesFromDB();
      if (offlineHeroes && offlineHeroes.length > 0) {
        setHeroes(offlineHeroes);
        setFilteredHeroes(offlineHeroes);
        console.log("Datos cargados desde IndexedDB");
      }

      if (navigator.onLine) {
        try {
          const response = await axios.get("https://swapi.dev/api/people/");
          setHeroes(response.data.results);
          setFilteredHeroes(response.data.results);
          await saveHeroesToDB(response.data.results);
          console.log("Datos cargados desde la API y guardados en IndexedDB");
        } catch (error) {
          console.error("Error fetching data from the API:", error);
        }
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="hero-container">
        {filteredHeroes.map((hero, index) => (
          <div className="hero-card" key={index}>
            <img
              src={`https://starwars-visualguide.com/assets/img/characters/${
                index + 1
              }.jpg`}
              alt={hero.name}
              className="hero-image"
            />
            <h2>{hero.name}</h2>
            <p>
              <strong>Height:</strong> {hero.height} cm
            </p>
            <p>
              <strong>Mass:</strong> {hero.mass} kg
            </p>
            <p>
              <strong>Gender:</strong> {hero.gender}
            </p>
            <p>
              <strong>Birth Year:</strong> {hero.birth_year}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCard;
