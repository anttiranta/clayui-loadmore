import React, {Fragment} from 'react';
import {array, func, number, bool, shape} from "prop-types";
import ClayList from '@clayui/list';

import LoadMoreButton from '../../components/LoadMoreButton';

const List = ({items, pageControl, incrementSize}) => {
    const content = items.length > 0 ? (
        items.map((item) => {
            return (
                <ClayList.Item flex key={item.id}>
                    <ClayList.ItemField>{item.id}</ClayList.ItemField>
                    <ClayList.ItemField>{item.quote}</ClayList.ItemField>
                </ClayList.Item>
            )
        })
    ) : null;

    return (
        <Fragment>
            <ClayList.Header>Programming quotes</ClayList.Header>
            {content}
            <LoadMoreButton
                pageControl={pageControl}
                incrementSize={incrementSize}/>
        </Fragment>
    );
};

List.propTypes = {
    items: array.isRequired,
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

export default List;