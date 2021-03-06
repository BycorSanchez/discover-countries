import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { range, lazyLoadConfig, lazyLoadImage, photoSrc } from "../helper";
import styles from "../styles/Gallery.module.css";
import placeholder from "../images/placeholder.png";

//Gallery must load photos, in order to display the preloader
class Gallery extends Component {
  static propTypes = {
    photos: PropTypes.array.isRequired,
    columns: PropTypes.number.isRequired,
    deviceWidth: PropTypes.number.isRequired
  };

  state = {
    modal: undefined
  };

  constructor() {
    super();
    this.imageRefs = [];
    this.observer = new IntersectionObserver(lazyLoadImage, lazyLoadConfig);
  }

  componentDidMount() {
    this.imageRefs.forEach(i => this.observer.observe(i));
  }

  _openModal = modal => this.setState({ modal });

  _closeModal = () => this.setState({ modal: undefined });

  _renderColumn = column => {
    const { photos, columns, deviceWidth } = this.props;
    const widthPercent = 100 / columns;
    const width = deviceWidth / columns;

    //Get photo indexes for this column
    const indexes = range(column, photos.length, columns);

    return (
      <div
        key={column}
        className={styles.column}
        style={{ width: "calc( " + widthPercent + "% - 10px )" }}
      >
        {indexes.map(index => (
          <img
            key={index}
            src={placeholder}
            data-src={photoSrc(photos[index], width)}
            alt={photos[index].photographer + " photo"}
            onClick={() => this._openModal(index)}
            ref={ref => this.imageRefs.push(ref)}
            className={styles.photo}
          />
        ))}
      </div>
    );
  };

  render() {
    const { photos, columns, deviceWidth } = this.props;
    const { modal } = this.state;

    return (
      <section id="gallery" className={styles.gallery}>
        {[...Array(columns).keys()].map(this._renderColumn)}

        {modal !== undefined && (
          <Modal
            photos={photos}
            selected={modal}
            onExit={this._closeModal}
            width={deviceWidth}
          />
        )}
      </section>
    );
  }
}

export default Gallery;
