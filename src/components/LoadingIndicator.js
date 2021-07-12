import React from 'react';
import { bool } from "prop-types";
import ClayLoadingIndicator from '@clayui/loading-indicator';

import './loadingIndicator/indicator.css';

const LoadingIndicator = (props) => {
    const defaultClasses = "root";
    const className = props.global ? defaultClasses + " global" : defaultClasses;

    return (
        <div className={className}>
            <ClayLoadingIndicator />
        </div>
    );
};

LoadingIndicator.propTypes = {
    global: bool
};

export default LoadingIndicator;
