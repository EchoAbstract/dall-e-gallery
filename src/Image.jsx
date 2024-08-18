import PropTypes from "prop-types";

import "./Image.css";

function Image(props) {
  const { file, description, thumbnail, imageClickTrigger, imageSetter } =
    props;

  const onClick = () => {
    imageClickTrigger();
    imageSetter({ file, description });
  };

  return (
    <>
      <div className="image" onClick={onClick}>
        <p>{description}</p>
        <img className="image-img" src={thumbnail} alt={description}></img>
      </div>
    </>
  );
}

Image.propTypes = {
  file: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageClickTrigger: PropTypes.func.isRequired,
  imageSetter: PropTypes.func.isRequired,
};
export default Image;
