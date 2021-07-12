import {useCallback} from 'react';

export const useLoadMoreButton = props => {
    const {
        dataLoaded,
        setInitPageSize,
        page,
        setPage,
        setOffset,
        total,
        loading
    } = props.pageControl;
    const incrementSize = props.incrementSize;

    const loadMore = useCallback(() => {
        if (total && dataLoaded >= total) {
            return;
        }

        const offset = dataLoaded;

        setPage(page + 1);
        setOffset(offset);
        setInitPageSize(offset + incrementSize);
    }, [
        page,
        dataLoaded,
        total,
        setInitPageSize,
        setOffset
    ]);

    const firstPageLoading = loading && page === 1;
    const noMore = (!firstPageLoading && !total) || (!!total && dataLoaded >= total);

    return {
        loadMore,
        noMore
    }
};