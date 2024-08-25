import { useState } from "react";

import "./App.css";

import Gallery from "./Gallery.jsx";
import ImageOverlay from "./ImageOverlay.jsx";

import { useFadeState, shouldShow } from "./fade.js";
import listImages from "./listImages.js";
import { getURLHash } from "./routing.js";

function makeNotFoundImage() {
  return {
    file: "./404.png",
    description: "Couldn't find the image you requested :-(",
  };
}

function getImageFromURL() {
  const hash = getURLHash(window.location);
  let urlMatch = listImages().find((img) => img.hash === hash);

  if (hash && !urlMatch) {
    // We couldn't find anything at that URL
    // 404d
    urlMatch = makeNotFoundImage();
  }
  return urlMatch;
}

function App() {
  const img = getImageFromURL();
  const shouldStartLoad = !!img;
  const [fadeState, fadeStep] = useFadeState(shouldStartLoad);
  const [image, setImage] = useState(img);

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
