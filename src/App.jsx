import { useState } from "react";

import "./App.css";

import Gallery from "./Gallery.jsx";
import ImageOverlay from "./ImageOverlay.jsx";

function App() {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const classes = `heading ${show ? "hidden" : ""}`;

  return (
    <>
      <h1 className={classes}>
        <span className="rainbow">DALL•E Gallery</span>
      </h1>
      <ImageOverlay image={image} show={show} showSetter={setShow} />
      <Gallery visibilitySetter={setShow} imageSetter={setImage} />
    </>
  );
}

export default App;
