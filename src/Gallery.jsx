import PropTypes from 'prop-types';

import './Gallery.css'

import Image from './Image.jsx'

import listImages from './listImages.js'

function Gallery(props) {
  const { visibilitySetter, imageSetter } = props;

  const images = listImages().map((image) => {
    return <Image 
      key={image.file}
      file={image.file}
      description={image.description}
      visibilitySetter={visibilitySetter}
      imageSetter={imageSetter}
    />;
  });

  return (
    <>
      <div className="gallery">
        {images}
      </div>
    </>
  )
}

Gallery.propTypes = {
  visibilitySetter: PropTypes.func.isRequired,
  imageSetter: PropTypes.func.isRequired,
}

export default Gallery
