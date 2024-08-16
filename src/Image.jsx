import PropTypes from 'prop-types';

import './Image.css'

function handleClick(visibilitySetter, imageSetter, file, description){ 
  visibilitySetter(true);
  imageSetter({file, description});
}

function Image(props) {

  const { file, description, visibilitySetter, imageSetter } = props;

  const clickWrapper = () => {
    return handleClick(visibilitySetter, imageSetter, file, description);
  };

  return (
    <>
      <div className="image" onClick={clickWrapper}>
        <p>{description}</p>
        <img className="image-img" src={file} alt={description}></img>
      </div>
    </>
  )
}

Image.propTypes = {
  file: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  visibilitySetter: PropTypes.func.isRequired,
  imageSetter: PropTypes.func.isRequired,
}
export default Image
