import { useEffect } from "react";
import MegamanOne from "../../assets/megaman/Megaman1.png";
import MegamanTwo from "../../assets/megaman/Megaman2.png";
import MegamanStop from "../../assets/megaman/Megaman3.png";
import MegamanLoose from "../../assets/megaman/Megaman4.png";
import SoldierOne from "./../../assets/soldier/Soldier1.png";
import SoldierTwo from "./../../assets/soldier/Soldier2.png";
import SoldierStop from "./../../assets/soldier/Soldier3.png";
import SoldierLoose from "./../../assets/soldier/Soldier4.png";
import CharacterTwoOne from "./../../assets/Character2/Character2Frame1.png";
import CharacterTwoTwo from "./../../assets/Character2/Character2Frame2.png";
import CharacterTwoJump from "./../../assets/Character2/Character2Jump.png";
import CharacterTwoLose from "./../../assets/Character2/Character2Lose.png";
import CharacterThreeOne from "./../../assets/Character3/Character3Frame1.png";
import CharacterThreeTwo from "./../../assets/Character3/Character3Frame2.png";
import CharacterThreeJump from "./../../assets/Character3/Character3Jump.png";
import CharacterThreeLose from "./../../assets/Character3/Character3Lose.png";
import CharacterFourOne from "./../../assets/Character4/Character4Frame1.png";
import CharacterFourTwo from "./../../assets/Character4/Character4Frame2.png";
import CharacterFourJump from "./../../assets/Character4/Character4Jump.png";
import CharacterFourLose from "./../../assets/Character4/Character4Lose.png";

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0012;
const Vehicle_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let VehicleFrame;
let yVelocity;

export const updateVehicle = (
  delta,
  speedScale,
  setVehicleFrame,
  setVehicleBottom
) => {
  handleRun(delta, speedScale, setVehicleFrame);
  handleJump(delta, setVehicleBottom);
};

let currentFrameTime = 0;
let isJumping;
let bottom = 0;
const handleJump = (delta, setVehicleBottom) => {
  if (!isJumping) return;
  bottom = yVelocity * delta + bottom;
  setVehicleBottom(bottom);
  if (bottom <= 0) {
    setVehicleBottom(0);
    bottom = 0;
    isJumping = false;
  }
  
  yVelocity -= GRAVITY * delta;
  return;
};
const handleRun = (delta, speedScale, setVehicleFrame) => {
  if (isJumping) {
    setVehicleFrame(2);
    return;
  }
  if (currentFrameTime >= FRAME_TIME) {
    VehicleFrame = (VehicleFrame + 1) % Vehicle_FRAME_COUNT;
    setVehicleFrame(VehicleFrame);
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
  return;
};
export const setVehicleLoose = (setVehicleFrame) => {
  setVehicleFrame(3);
};

export const onJump = (e) => {
  if (
    (e.code !== "Space" && e.code !== "ArrowUp" && e.code !== "Numpad8") ||
    isJumping
  )
    return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
  return;
};

export const Vehicle = ({ frame, bottom, vehicleRef, currentVehicle }) => {
  const vehicles = [
    /*0*/ [SoldierOne, SoldierTwo, SoldierStop, SoldierLoose],
    /*1*/ [MegamanOne, MegamanTwo, MegamanStop, MegamanLoose],
    /*2*/ [CharacterTwoOne, CharacterTwoTwo, CharacterTwoJump, CharacterTwoLose],
    /*3*/ [CharacterThreeOne, CharacterThreeTwo, CharacterThreeJump, CharacterThreeLose],
    /*4*/ [CharacterFourOne, CharacterFourTwo, CharacterFourJump, CharacterFourLose],
  ];

  useEffect(() => {
    isJumping = false;
    VehicleFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    document.addEventListener("keydown", onJump);
    return () => {
      document.removeEventListener("keydown", onJump);
    };
  }, []);

  return (
    <img
      className="vehicle"
      src={vehicles[currentVehicle][frame]}
      alt="Vehicle"
      style={{
        bottom: `${bottom}%`,
        height: `${
          currentVehicle === 2 ? "15" : currentVehicle === 3 ? "12" : "16"
        }%`,
      }}
      ref={vehicleRef}
    />
  );
};
