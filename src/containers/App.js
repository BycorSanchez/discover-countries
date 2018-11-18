import "../styles/App.css";
import React, { Component } from "react";
import Front from "./Front";
import Gallery from "./Gallery";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import sizes from "react-sizes";
import { fetchFrontData, fetchImages, imageSize } from "../api";

class App extends Component {
    static sizesToProps({ width }) {
        return { deviceWidth: width };
    }

    state = {
        dataList: [],
        imageList: undefined,
        selected: undefined,
        modal: undefined,
        galleryError: false
    };

    componentDidMount() {
        fetchFrontData()
            .then(dataList => this.setState({ dataList }))
            .catch(() =>
                console.error("Front page information could not be loaded")
            );
    }

    _onSelect = item => {
        this.setState({
            selected: item,
            imageList: undefined,
            galleryError: false
        });
        if (item !== undefined) {
            this._loadImageList(item);
        }
    };

    _loadImageList(item) {
        const data = this.state.dataList[item];
        fetchImages(data.title)
            .then(imageList => this.setState({ imageList }))
            .catch(() => {
                this.setState({ galleryError: true });
                console.error("Gallery images could not be loaded");
            });
    }

    _openModal = modal => {
        const length = this.state.imageList.length;
        if (modal > -1 && modal < length) {
            this.setState({ modal });
        }
    };

    _closeModal = () => this.setState({ modal: undefined });

    _anySelected = () => this.state.selected !== undefined;

    _anyModal = () => this.state.modal !== undefined;

    _columns = width => (width < 1000 ? (width < 700 ? 2 : 3) : 5);

    _imageSource = (data, width) => data.src[imageSize(width)];

    render() {
        const {
            dataList,
            selected,
            modal,
            imageList,
            galleryError
        } = this.state;
        const deviceWidth = this.props.deviceWidth;

        const columns = this._columns(deviceWidth);

        return (
            <div className="App">
                <main>
                    <section>
                        <Front
                            dataList={dataList}
                            selected={selected}
                            onSelect={this._onSelect}
                            isMobile={deviceWidth < 600}
                        />
                    </section>

                    {this._anySelected() && !galleryError && (
                        <section id="gallery">
                            {imageList ? (
                                <Gallery
                                    images={imageList.map(i =>
                                        this._imageSource(
                                            i,
                                            deviceWidth / columns
                                        )
                                    )}
                                    columns={columns}
                                    click={this._openModal}
                                />
                            ) : (
                                <span className="loading-cube">
                                    <Loading type="cubes" />
                                </span>
                            )}
                        </section>
                    )}

                    {this._anyModal() && imageList && (
                        <Modal
                            image={this._imageSource(
                                imageList[modal],
                                deviceWidth
                            )}
                            close={this._closeModal}
                            next={() => this._openModal(modal + 1)}
                            previous={() => this._openModal(modal - 1)}
                            showPrevious={modal > 0}
                            showNext={modal < imageList.length - 1}
                        />
                    )}
                </main>
                {this._anySelected() && (
                    <footer>
                        <p>
                            🖼 from <a href="https://www.pexels.com/">Pexels</a>.
                            With <span className="heart">♥</span> by{" "}
                            <a href="https://github.com/BycorSanchez">Bycor</a>
                        </p>
                    </footer>
                )}
            </div>
        );
    }
}

export default sizes(App.sizesToProps)(App);
