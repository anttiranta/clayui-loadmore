import React from 'react';
import {string, shape} from 'prop-types';

import {useFrontpage} from "../talons/useFrontpage";
import fullPageLoadingIndicator from '../components/loadingIndicator/static';
import List from "./frontpage/List";

const Frontpage = (props) => {
    const id = props?.match?.params?.id ? parseInt(props.match.params.id) : 0;

    const {
        error,
        loading,
        items,
        pageControl,
        incrementSize
    } = useFrontpage(id);

    let loadingIndicator = null;
    if (loading) {
        loadingIndicator = fullPageLoadingIndicator;
    }

    if (error && pageControl.page === 1) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return (
            <p>Couldn't fetch data. Sorry :(</p>
        );
    }

    return (
        <div>
            <List items={items}
                  pageControl={pageControl}
                  incrementSize={incrementSize}
            />
            {loadingIndicator}
        </div>
    );
};

Frontpage.propTypes = {
    match: shape({
        params: shape({
            id: string
        })
    })
};

export default Frontpage;