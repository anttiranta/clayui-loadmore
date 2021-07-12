import {useEffect, useCallback, useRef} from 'react';

import {useLoadMore} from "../hooks/useLoadMore";
import {useInfiniteResource} from '../hooks/useInfiniteResource';
import {useApiContext} from '../context/ApiContext'
import {concatPagination} from "../utils/frontpage/pagination";

export const useFrontpage = (id) => {
    const {cache: storage} = useApiContext();
    const quoteItemsPageSize = 30;

    const [loadMoreState, loadMoreApi] = useLoadMore({incrementSize: quoteItemsPageSize});

    const {page, pageSize, offset, total} = loadMoreState;
    const {setPage, setOffset, setTotal, setInitPageSize} = loadMoreApi;

    // Keep track of the id so we can tell when it changes (in this example, never).
    const previousId = useRef(id);

    // Query for fetching quote data 
    const {get: runQuoteQuery, resource, error, loading, resetQueryData} = useInfiniteResource({
        variables: {page: page, limit: pageSize, offset: offset},
        fetchPolicy: "cache-first",
        storage,
        link: "https://api.javascripttutorial.net/v1/quotes/",
        offsetKey: `offset`,
        pageSizeKey: `limit`,
        mergeResultFunction: concatPagination,
        getPageableData: (resource) => resource?.data || []
    });

    const totalCountFromData = resource?.total || 0;
    const noMore = !!totalCountFromData && resource.length >= totalCountFromData;

    // Reset function for the quote query
    const reload = useCallback(() => {
        setPage(1);
        setOffset(0);
        setTotal(0);
        setInitPageSize();
        resetQueryData();
    }, [quoteItemsPageSize, resetQueryData]);

    // Run the quote query immediately and whenever its variable values change. 
    useEffect(() => {
        if (!noMore) {
            runQuoteQuery();
        }
    }, [page, noMore]);

    useEffect(() => {
        setTotal(totalCountFromData);
    }, [setTotal, totalCountFromData]);

    // If we get an error after loading we should try to reset the values
    useEffect(() => {
        if (error && !loading && page !== 1) {
            reload();
        }
    }, [page, error, loading, reload]);

    // Reset the values when the ID changes (in this example, never)
    useEffect(() => {
        if (previousId.current !== id) {
            reload();
            previousId.current = id; // update the ref
        }
    }, [id, previousId, reload]);

    const data = resource && resource.data ? resource.data : [];

    const pageControl = {
        dataLoaded: data.length,
        setInitPageSize,
        page,
        setPage,
        setOffset,
        total,
        loading
    };

    return {
        error,
        loading,
        items: data,
        pageControl,
        incrementSize: quoteItemsPageSize
    };
};