import PropTypes from "prop-types";

import "./Image.css";

import { route } from "./routing.js";

function Image(props) {
  const { file, description, thumbnail, hash, imageClickTrigger, imageSetter } =
    props;

  const onClick = () => {
    imageClickTrigger();
    imageSetter({ file, description });
    route(hash);
  };

  return (
    <>
      <div className="image" onClick={onClick}>
        <p>{description}</p>
        <img
          className="image-img"
          loading="lazy"
          src={thumbnail}
          alt={description}
        ></img>
      </div>
    </>
  );
}

Image.propTypes = {
  file: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageClickTrigger: PropTypes.func.isRequired,
  imageSetter: PropTypes.func.isRequired,
};
export default Image;
