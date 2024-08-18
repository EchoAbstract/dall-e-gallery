import { useState } from "react";

import "./App.css";

import Gallery from "./Gallery.jsx";
import ImageOverlay from "./ImageOverlay.jsx";

import { useFadeState, shouldShow } from "./fade.js";

function App() {
  const [fadeState, fadeStep] = useFadeState();
  const [image, setImage] = useState(null);

  const classes = `heading ${shouldShow(fadeState) ? "hidden" : ""}`;

  return (
    <>
      <h1 className={classes}>
        <span className="rainbow">DALL•E Gallery</span>
      </h1>
      <ImageOverlay image={image} fadeState={fadeState} fadeStep={fadeStep} />
      <Gallery imageClickTrigger={fadeStep} imageSetter={setImage} />
    </>
  );
}

export default App;
