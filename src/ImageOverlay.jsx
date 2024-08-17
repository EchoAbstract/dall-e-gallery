import PropTypes from "prop-types";

import "./ImageOverlay.css";

function handleClick(showSetter) {
  showSetter(false);
}

function ImageOverlay(props) {
  const { image, show, showSetter } = props;
  if (!image) {
    return <></>;
  }
  const { file, description } = image;
  const clickWrapper = () => {
    return handleClick(showSetter);
  };

  console.log("fudge", image, show);

  return (
    <>
      {show && image && (
        <div className="image-overlay" onClick={clickWrapper}>
          <h2>
            <span className="prompt">Prompt:</span> {description}
          </h2>
          <img className="image-overlay-img" src={file} alt={description}></img>
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
  show: PropTypes.bool.isRequired,
  showSetter: PropTypes.func.isRequired,
};

export default ImageOverlay;
