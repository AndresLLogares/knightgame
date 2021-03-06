import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Vehicle, onJump, setVehicleLoose, updateVehicle } from "./Vehicle.jsx";
import { Ground, updateGround } from "./Ground.jsx";
import {
  getCustomProperty,
  incrementCustomProperty,
} from "./../../helpers/updateProperty";
import EnemyOne from "./../../assets/enemys/enemy1.gif";
import EnemyTwo from "./../../assets/enemys/enemy2.gif";
import EnemyThree from "./../../assets/enemys/enemy3.gif";
import EnemyFour from "./../../assets/enemys/enemy4.gif";
import EnemyFive from "./../../assets/enemys/enemy5.gif";
import EnemySix from "./../../assets/enemys/enemy6.gif";
import JumpIcon from "./../../assets/icons/Jump.png";
import Obstacle from "./Obstacle.jsx";
import West from "./../../assets/bg/west.png";
import Warzone from "./../../assets/bg/warzone.png";
import Future from "./../../assets/bg/future.png";
import Wood from "../../assets/bg/backgroundBeach.png";
import Music from "../../assets/music/musicMegaman.mp3";
import Lose from "../../assets/sound/lose.mp3";

const Game = ({
  setPage,
  score,
  setScore,
  highScore,
  setHighScore,
  currentVehicle,
  currentDifficulty,
  currentLocation,
  includedObstacles,
}) => {
  const [worldStyle, setWorldStyle] = useState();
  const [groundLeft, setGroundLeft] = useState([0, 1300]);
  const [vehicleFrame, vetVehicleFrame] = useState(0);
  const [vehicleBottom, setvehicleBottom] = useState(0);
  const [cactuses, setCactuses] = useState([]);
  const [lost, setLost] = useState(false);

  const worldRef = useRef(null);
  const cactusRefs = useRef([]);
  const vehicleRef = useRef(null);

  const locations = [Wood, West, Warzone, Future];

  const WORLD_WIDTH = 150;
  const WORLD_HEIGHT = 100;
  const SPEED = 0.05;
  const OBSTACLE_INTERVAL_MAX = 2000;

  let lastTime;
  let speedScale;
  let newScore = 0;
  let nextCactusTime = 0;
  let cactusRefsIndex = 0;
  let obstacleIntervalMin = 1000;
  let speedScaleIncrease = 0.00001;
  let themeMegaman = new Audio(Music);
  themeMegaman.loop = true;
  themeMegaman.volume = 0.1;
  let lose = new Audio(Lose);
  lose.volume = 0.3;
  lose.loop = false;

  let obstacles = [
    { id: 0, item: EnemyOne, height: "20%" },
    { id: 1, item: EnemyTwo, height: "20%" },
    { id: 2, item: EnemyThree, height: "20%" },
    { id: 3, item: EnemyFour, height: "20%" },
    { id: 4, item: EnemyFive, height: "20%" },
    { id: 5, item: EnemySix, height: "20%" },
  ];
  const checkDifficulty = () => {
    switch (currentDifficulty) {
      case 0:
        obstacleIntervalMin = 1200;
        speedScaleIncrease = 0.000008;
        break;
      case 1:
        break;
      case 2:
        obstacleIntervalMin = 750;
        speedScaleIncrease = 0.00003;
        break;

      default:
        break;
    }
  };

  const modifyObstacles = () => {
    obstacles = obstacles.filter((obstacle) =>
      includedObstacles.includes(obstacle.id)
    );
  };

  const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const getCactusRect = () => {
    let elm;
    if (cactusRefs.current[0].current !== null)
      return cactusRefs.current.map((cactus) => {
        elm = ReactDOM.findDOMNode(cactus.current);
        if (elm !== null) return elm.getBoundingClientRect();
        return {};
      });
    return [];
  };

  const handleLoose = () => {
    setVehicleLoose(vetVehicleFrame);
    setLost(true);
    themeMegaman.pause();
    lose.play();
    setTimeout(() => setPage(3), 1000);
    newScore = 0;
  };

  const checkLoose = () => {
    const vehicleRect = vehicleRef.current.getBoundingClientRect();
    const reducedRects = {
      left: vehicleRect.left - 3,
      right: vehicleRect.right - 3,
      bottom: vehicleRect.bottom - 3,
      top: vehicleRect.top - 3,
    };
    return getCactusRect().some((rect) => isCollision(rect, reducedRects));
  };

  const isCollision = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    );
  };

  const createCactus = () => {
    cactusRefs.current.push(React.createRef());
    const cactus = Obstacle({
      ref: cactusRefs.current[cactusRefsIndex],
      item: obstacles[randomNumberBetween(obstacles.length, -1)],
    });
    let newCactusArray = cactuses;
    newCactusArray.push(cactus);
    setCactuses(newCactusArray);
    cactusRefsIndex++;
  };

  const setupCactus = () => {
    if (cactusRefs.current[0] !== 0)
      cactusRefs.current.map((cactus) => cactus.current.remove());
  };

  const updateCactus = (delta, speedScale) => {
    if (cactusRefs.current[0] !== 0)
      cactusRefs.current.forEach((cactus) => {
        incrementCustomProperty(
          cactus.current,
          "--left",
          delta * speedScale * SPEED * -1
        );
        if (getCustomProperty(cactus.current, "--left") <= -100) {
          cactus.current.remove();
        }
      });
    if (nextCactusTime <= 0) {
      createCactus();
      cactusRefs.current.forEach((cactus) => {});
      nextCactusTime =
        randomNumberBetween(OBSTACLE_INTERVAL_MAX, obstacleIntervalMin) /
        speedScale;
    }
    nextCactusTime -= delta;
  };

  const setPixleToWorldSacle = () => {
    let worldToPixleScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
      worldToPixleScale = window.innerWidth / WORLD_WIDTH;
    } else {
      worldToPixleScale = window.innerHeight / WORLD_HEIGHT;
    }
    setWorldStyle({
      height: `${WORLD_HEIGHT * worldToPixleScale}px`,
      width: `${WORLD_WIDTH * worldToPixleScale}px`,
    });
  };

  const handleStart = () => {
    lastTime = null;
    speedScale = 1;
    checkDifficulty();
    modifyObstacles();
    setupCactus();
    themeMegaman.play();
    window.requestAnimationFrame(update);
  };

  const update = (time) => {
    if (lastTime == null) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTime;
    setGroundLeft(updateGround(delta, speedScale));
    updateVehicle(delta, speedScale, vetVehicleFrame, setvehicleBottom);
    updateSpeedScale(delta);
    updateScore(delta);
    updateCactus(delta, speedScale);
    if (checkLoose()) return handleLoose();
    lastTime = time;
    window.requestAnimationFrame(update);
  };

  const updateSpeedScale = (delta) => {
    speedScale += delta * speedScaleIncrease;
  };

  const updateScore = (delta) => {
    newScore += delta * 0.01;
    setScore(Math.floor(newScore));
    if (newScore > Number(highScore)) setHighScore(Math.floor(newScore));
  };

  useEffect(() => {
    setPixleToWorldSacle();
    window.addEventListener("resize", setPixleToWorldSacle);
    handleStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("highScore", String(highScore));
  }, [highScore]);

  return (
    <>
      {lost && <h2 className="over-title game-over">game over</h2>}
      <div
        style={{
          ...worldStyle,
        }}
        className="world"
        ref={worldRef}
      >
        <div className="score">
          Score:<span>{score}</span>
        </div>
        <div className="score high-score">
          Hi:<span>{highScore}</span>
        </div>
        <Vehicle
          frame={vehicleFrame}
          bottom={vehicleBottom}
          vehicleRef={vehicleRef}
          currentVehicle={currentVehicle}
        />
        <Ground left={groundLeft} location={locations[currentLocation]} />
        {cactuses && cactuses.map((cactus) => cactus)}
      </div>
      <button onClick={() => onJump({ code: "Space" })} className="jump-button">
        <img src={JumpIcon} alt="jump" />
      </button>
    </>
  );
};

export default Game;
