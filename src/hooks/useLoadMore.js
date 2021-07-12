import {useEffect, useState, useCallback, useMemo} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import {getSearchParam} from './useSearchParam';

const setQueryParam = ({history, location, parameter, value}) => {
    const {search} = location;
    const queryParams = new URLSearchParams(search);

    queryParams.set(parameter, value);
    const destination = {search: queryParams.toString()};

    history.replace(destination);
};

export const useLoadMore = (props) => {
    const {
        namespace = '',
        parameter = 'page-size',
        incrementSize
    } = props;

    const location = useLocation();
    const history = useHistory();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const searchParam = namespace ? namespace + '_' + parameter : parameter;
    const initPageSize = parseInt(getSearchParam(searchParam, location));

    const setInitPageSize = useCallback(
        (pageSize) => {
            setQueryParam({
                history,
                location,
                parameter: searchParam,
                value: pageSize
            });
        },
        [history, location, searchParam]
    );

    // Make sure that location contains a page size
    useEffect(() => {
        if (!initPageSize) {
            setInitPageSize(incrementSize);
        }
    }, [incrementSize, initPageSize, setInitPageSize]);

    const pageSize = page === 1 ? (initPageSize || incrementSize) : incrementSize;

    const api = useMemo(
        () => ({
            setPage,
            setOffset,
            setTotal,
            setInitPageSize
        }),
        [setPage, setOffset, setTotal, setInitPageSize]
    );

    const state = {
        page,
        pageSize,
        offset,
        total
    };

    return [state, api];
}

export default useLoadMore;