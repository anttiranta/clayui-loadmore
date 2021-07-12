import React, {Fragment} from 'react';
import {bool, func, number, shape} from 'prop-types';

import {useLoadMoreButton} from "../hooks/useLoadMoreButton";
import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";

const LoadMoreButton = props => {
    const {dataLoaded, loading, total} = props.pageControl;
    const buttonText = "Load more";

    const {loadMore, noMore} = useLoadMoreButton(props);

    return (
        <Fragment>
            <div className="row justify-content-center">
                <p><strong>{dataLoaded}</strong>/{total}</p>
            </div>
            {!noMore && (
                <div className="row justify-content-center">
                    <p>
                        <ClayButton
                            className="load-more-btn"
                            displayType="primary"
                            disabled={loading}
                            onClick={loadMore}
                            aria-label={buttonText}
                        >
                            {buttonText}
                            <span className="inline-item inline-item-after">
                              <ClayIcon symbol="plus" />
                            </span>
                        </ClayButton>
                    </p>
                </div>
            )}
        </Fragment>
    );
};

LoadMoreButton.propTypes = {
    pageControl: shape({
        dataLoaded: number,
        setInitPageSize: func,
        page: number,
        setPage: func,
        setOffset: func,
        total: number,
        loading: bool
    }).isRequired,
    incrementSize: number.isRequired
};

export default LoadMoreButton;
