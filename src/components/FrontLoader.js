import React, { Component } from 'react';
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import styles from "../styles/FrontLoader.module.css";
import imagesIcon from "../images/images.svg";
import passportIcon from "../images/passport.svg";
import suitcaseIcon from "../images/suitcase.svg";
import boardingPassIcon from "../images/boardingpass.svg";
import errorIcon from "../images/error.svg";

const PERIOD_MS = 1500;

const data = [
    {
        image: imagesIcon,
        color: "#f3c97c",
        message: "Loading images"
    },
    {
        image: passportIcon,
        color: "#66ca66",
        message: "Looking for passports"
    },
    {
        image: suitcaseIcon,
        color: "#7eb4e0",
        message: "Packing the suitcase"
    },
    {
        image: boardingPassIcon,
        color: "#a76ad2",
        message: "Printing boarding passes"
    }
];

const errorMessage = {
    image: errorIcon,
    color: "#e82525",
    message: "Oops! Something went wrong.."
};

class FrontLoader extends Component {

    static props = {
        display: PropTypes.bool,
        error: PropTypes.bool
    }

    static defaultProps = {
        display: true,
        error: false
    }

    state = {
        current: 0
    }

    _updateMessage = () => {
        const current = (this.state.current + 1) % data.length;
        this.setState({ current });
    }

    componentDidMount() {
        this.interval = setInterval(this._updateMessage, PERIOD_MS);
    }

    componentDidUpdate() {
        const { display, error } = this.props;
        if (error || !display) {
            this._clearInterval();
        }
    }

    componentWillUnmount() {
        this._clearInterval();
    }

    _clearInterval(){
        if (this.interval){
            this.interval = clearInterval(this.interval);
        } 
    }

    render() {
        const { display, error } = this.props;
        const info = error ? errorMessage : data[this.state.current];

        return (
            <CSSTransition
                in={display}
                classNames={{
                    enter: styles.frontLoaderEnter,
                    exit: styles.frontLoaderExit,
                    exitDone: styles.frontLoaderExitDone
                }}
                timeout={400}
                unmountOnExit
            >
                <div className={styles.background}>
                    <div className={styles.container}>
                        <div
                            className={styles.circle}
                            style={{ background: info.color }}
                        >
                            <object 
                                type="image/svg+xml" 
                                data={info.image}
                                className={styles.icon}
                            >
                                Loading
                            </object>
                        </div>
                        <h2 className={styles.message}>{info.message}</h2>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default FrontLoader;