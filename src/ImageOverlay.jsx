import PropTypes from "prop-types";
import "./ImageOverlay.css";

import { fadingClassForState, shouldShow } from "./fade";

import { home } from "./routing";

function animationEndHack() {
  document.getElementsByClassName("image-overlay")[0].style.display = "none";
}

function ImageOverlay(props) {
  const { image, fadeState, fadeStep } = props;
  if (!image) {
    return <></>;
  }
  const { file, description } = image;

  const onClick = () => {
    fadeStep();
    home();
  };

  const onAnimationEnd = (event) => {
    console.log(`Animation ended: ${event.animationName}`);
    if (event.animationName === "fadeOut" || event.animationName === "fadeIn") {
      fadeStep();
    }

    if (event.animationName === "fadeOut") {
      animationEndHack();
    }
  };

  const onAnimationStart = (event) => {
    console.log(`Animation started: ${event.animationName}`);
  };

  const classes = `image-overlay ${fadingClassForState(fadeState)} ${shouldShow(fadeState) ? "" : "hidden"}`;

  console.log(shouldShow(fadeState), classes);

  const img = new Image();
  img.onload = () => {
    const domImage = document.getElementById("image-overlay-img");
    domImage.src = file;
    domImage.classList.remove("loading");
  };
  img.src = file;

  return (
    <>
      {shouldShow(fadeState) && image && (
        <div
          className={classes}
          onClick={onClick}
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
        >
          <h2>
            <span className="prompt">Prompt:</span> {description}
          </h2>
          <img
            id="image-overlay-img"
            className="image-overlay-img loading"
            src="./images/loading.svg"
            alt={description}
          ></img>
        </div>
      )}
    </>
  );
}

ImageOverlay.propTypes = {
  image: PropTypes.shape({
    file: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  fadeState: PropTypes.string.isRequired,
  fadeStep: PropTypes.func.isRequired,
};

export default ImageOverlay;
