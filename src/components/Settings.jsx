import React, { useState } from "react";
import SettingsIcon from "./../assets/icons/Settings.png";
import CloseIcon from "./../assets/icons/close.png";
import ResetIcon from "./../assets/icons/reset.png";
import WestIcon from "./../assets/bg/west.png";
import FutureIcon from "./../assets/bg/future.png";
import WarzoneIcon from "./../assets/bg/warzone.png";
import EnemyOne from "./../assets/enemys/enemy1.gif";
import EnemyTwo from "./../assets/enemys/enemy2.gif";
import EnemyThree from "./../assets/enemys/enemy3.gif";
import EnemyFour from "./../assets/enemys/enemy4.gif";
import EnemyFive from "./../assets/enemys/enemy5.gif";
import EnemySix from "./../assets/enemys/enemy6.gif";
import MegamanOne from "../assets/megaman/Megaman1.png";
import SoldierOne from "./../assets/soldier/Soldier1.png";
import CharacterTwoOne from "./../assets/Character2/Character2Frame1.png";
import CharacterThreeOne from "./../assets/Character3/Character3Frame1.png";
import CharacterFourOne from "./../assets/Character4/Character4Frame1.png";
import Beach from "./../assets/bg/backgroundBeach.png";
import { Settings2Outline } from "@styled-icons/evaicons-outline/Settings2Outline";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Back } from "@styled-icons/entypo/Back";

const Settings = ({
  currentVehicle,
  setCurrentVehicle,
  currentDifficulty,
  setCurrentDifficulty,
  setCurrentLocation,
  currentLocation,
  includedObstacles,
  setIncludedObstacles,
  setHighScore,
  setScore,
}) => {
  const [isSetting, setIsSetting] = useState(false);

  const vehicles = [
    {
      id: 0,
      src: SoldierOne,
      name: "beanCar",
    },
    {
      id: 1,
      src: MegamanOne,
      name: "bike",
    },
    {
      id: 2,
      src: CharacterTwoOne,
      name: "bus",
    },
    {
      id: 3,
      src: CharacterThreeOne,
      name: "car",
    },
    {
      id: 4,
      src: CharacterFourOne,
      name: "cycle",
    },
  ];
  const locations = [
    {
      id: 0,
      src: Beach,
      name: "Beach",
    },
    {
      id: 1,
      src: WestIcon,
      name: "west",
    },
    {
      id: 2,
      src: WarzoneIcon,
      name: "warzone",
    },
    {
      id: 3,
      src: FutureIcon,
      name: "future",
    },
  ];
  const obstacles = [
    { id: 0, src: EnemyOne, name: "cactus" },
    { id: 1, src: EnemyTwo, name: "hole" },
    { id: 2, src: EnemyThree, name: "road block 1" },
    { id: 3, src: EnemyFour, name: "road block 2" },
    { id: 4, src: EnemyFive, name: "road block 3" },
    { id: 5, src: EnemySix, name: "road block 4" },
  ];
  const difficulties = [
    {
      id: 0,
      des: ["Slow Increase in speed", "Low Obstacles Density"],
      name: "ez mode",
    },
    {
      id: 1,
      des: ["Normal Increase in speed", "Normal Obstacles Density"],
      name: "chill mode",
    },
    {
      id: 2,
      des: ["High Increase in speed", "High Obstacles Density"],
      name: "tuff mode",
    },
  ];

  return (
    <>
      {!isSetting ? (
        <button className="settings-button" onClick={() => setIsSetting(true)}>
          <Settings2Outline className="settings-icon-config" />
        </button>
      ) : (
        <div className="settings-container">
          <div className="settings-row">
            <div className="settings-row-top">
              <h5>vehicles</h5>
              <button
                className="setting-btn"
                onClick={() => setIsSetting(false)}
              >
                <CloseOutline className="settings-icon-config" />
              </button>
            </div>
            <div className="settings-row-cards">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`settings-row-card ${
                    vehicle.id === currentVehicle && "setting-current"
                  }`}
                  onClick={() => setCurrentVehicle(vehicle.id)}
                >
                  <img src={vehicle.src} alt={vehicle.name} />
                </div>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-top">
              <h5>difficulties</h5>
            </div>
            <div className="settings-row-cards">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty.id}
                  className={`settings-row-card ${
                    difficulty.id === currentDifficulty && "setting-current"
                  }`}
                  onClick={() => setCurrentDifficulty(difficulty.id)}
                >
                  <p className="settings-row-card-title">{difficulty.name}</p>
                  <ul>
                    {difficulty.des.map((d) => (
                      <li>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-top">
              <h5>locations</h5>
            </div>
            <div className="settings-row-cards">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`settings-row-card ${
                    location.id === currentLocation && "setting-current"
                  }`}
                  onClick={() => setCurrentLocation(location.id)}
                >
                  <p className="settings-row-card-title">{location.name}</p>
                  <img src={location.src} alt={location.name} />
                </div>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-top">
              <h5>obstacles</h5>
            </div>
            <div className="settings-row-cards">
              {obstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className={`settings-row-card settings-small-img ${
                    includedObstacles.includes(obstacle.id) && "setting-current"
                  } ${
                    includedObstacles.includes(obstacle.id) &&
                    includedObstacles.length <= 1
                      ? "setting-disabled"
                      : "set"
                  }`}
                  onClick={() => {
                    if (
                      includedObstacles.includes(obstacle.id) &&
                      includedObstacles.length <= 1
                    )
                      return;
                    if (includedObstacles.includes(obstacle.id)) {
                      setIncludedObstacles(
                        includedObstacles.filter((io) => io !== obstacle.id)
                      );
                      return;
                    }
                    setIncludedObstacles([...includedObstacles, obstacle.id]);
                  }}
                >
                  <img src={obstacle.src} alt={obstacle.name} />
                </div>
              ))}
            </div>
          </div>
          <div className="settings-row settings-last">
            <div className="settings-row-top">{""}</div>
            <div className="settings-row-top">
              <h5>Reset Score</h5>
            </div>
            <button
              className="setting-btn"
              onClick={() => {
                setHighScore(0);
                setScore(0);
                localStorage.setItem("highScore", "0");
              }}
            >
              <Back className="settings-icon-config" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
