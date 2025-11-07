import React from 'react';
import { CircularProgress } from '@material-ui/core';
import './LoadingMask.styles.css';
import propTypes from './LoadingMask.types';
const LoadingMask = ({ size, thickness }) => {
    return (
        <div className="loading-mask-container">
            <CircularProgress
                size={size ? size : 100}
                thickness={thickness ? thickness : 2}
            />
        </div>
    );
};

LoadingMask.propTypes = propTypes;
export default LoadingMask;
