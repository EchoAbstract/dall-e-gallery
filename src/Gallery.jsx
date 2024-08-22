import PropTypes from "prop-types";

import "./Gallery.css";

import Image from "./Image.jsx";

import listImages from "./listImages.js";

function Gallery(props) {
  const { imageClickTrigger, imageSetter } = props;

  const images = listImages().map((image) => {
    return (
      <Image
        key={image.hash}
        file={image.file}
        thumbnail={image.thumbnail}
        hash={image.hash}
        description={image.description}
        imageClickTrigger={imageClickTrigger}
        imageSetter={imageSetter}
      />
    );
  });

  return (
    <>
      <div className="gallery">{images}</div>
    </>
  );
}

Gallery.propTypes = {
  imageClickTrigger: PropTypes.func.isRequired,
  imageSetter: PropTypes.func.isRequired,
};

export default Gallery;
