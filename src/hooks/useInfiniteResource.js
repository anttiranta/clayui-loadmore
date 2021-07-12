/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {useEffect, useRef, useState} from 'react';
import warning from 'warning';

import {useDebounce} from '@clayui/shared';
import {useCache} from '@clayui/data-provider/lib/useCache';
import {timeout} from '@clayui/data-provider/lib/util';

import {
	FetchPolicy,
	NetworkStatus,
	SYMBOL_ORIGIN,
} from '@clayui/data-provider/lib/types';

const useInfiniteResource = ({
	fetchDelay = 300,
	fetchOptions,
	fetchPolicy = NetworkStatus.Refetch,
	fetchTimeout = 6000,
	link,
	storage = {
		/**
		 * This will ensure that we know that the storage
		 * reference is not external, otherwise the cache
		 * will persist by the application.
		 */
		[SYMBOL_ORIGIN]: true,
	},
	storageMaxSize = 20,
	variables = null,
 	offsetKey,
	pageSizeKey,
 	mergeResultFunction,
	getPageableData = (resource) => { return resource || [] }
}) => {
	const [resource, setResource] = useState(null);
	const [state, setState] = useState(() => ({
		error: false,
		loading: false,
	}));

	// A flag to identify if the first rendering happened to avoid
	// two requests.
	const firstRenderRef = useRef(true);

	const isEqualCacheVariables = (vars, otherVars, offsetKey, pageSizeKey) => {
		// noinspection EqualityComparisonWithCoercionJS
		return vars[offsetKey] == otherVars[offsetKey] && vars[pageSizeKey] == otherVars[pageSizeKey];
	}

	const buildCacheVariables = (resource, variables, offsetKey, pageSizeKey) => {
		let pageableData = getPageableData(resource);

		let newVars;
		newVars = {...variables};
		newVars[offsetKey] = 0;
		newVars[pageSizeKey] = pageableData.length + parseInt(variables[pageSizeKey])

		return newVars;
	}

	const cacheVariables = buildCacheVariables(resource, variables, offsetKey, pageSizeKey);
	const shouldReadFromCache = isEqualCacheVariables(variables, cacheVariables, offsetKey, pageSizeKey);

	const cache = useCache(
		fetchPolicy,
		storage,
		storageMaxSize,
		link,
		cacheVariables
	);

	const debouncedVariablesChange = useDebounce(variables, fetchDelay);

	const resetQueryData = () => setResource(null);

	const fetchOnComplete = (result) => {
		const merged = mergeResultFunction(resource, result);

		setResource(merged);

		dispatchNetworkStatus(NetworkStatus.Unused);

		cache.set(merged);
	};

	const populateSearchParams = (uri, variables) => {
		if (!variables) {
			return uri;
		}

		const keys = Object.keys(variables);

		keys.forEach(key => uri.searchParams.set(key, variables[key]));

		return uri;
	};

	const getUrlFormat = (link, variables) => {
		const uri = new URL(link);

		warning(
			uri.searchParams.toString() === '',
			'DataProvider: We recommend that instead of passing parameters over the link, use the variables API. \n More details: https://next.clayui.com/docs/components/data-provider.html'
		);

		if (!variables) {
			return uri.toString();
		}

		populateSearchParams(uri, variables);

		return uri.toString();
	};

	const doFetch = () => {
		let promise;

		switch (typeof link) {
			case 'function':
				promise = link(
					populateSearchParams(
						// This is just a hack to be able to instantiate the URL and make
						// `populateSearchParams` reusable in `getUrlFormat` and make
						// things easier.
						new URL('http://clay.data.provider'),
						variables
					).searchParams.toString()
				);
				break;
			case 'string':
				promise = fetch(
					getUrlFormat(link, variables),
					fetchOptions
				).then(res => res.json());
				break;
			default:
				return null;
		}

		timeout(fetchTimeout, promise)
			.then(fetchOnComplete)
			.catch(err => {
				dispatchNetworkStatus(NetworkStatus.Error);
				warning(false, `DataProvider: Error making the requisition ${err}`);
			});
	};

	const maybeFetch = (status) => {
		const cacheData = shouldReadFromCache ? cache.get() : null;

		if (cacheData) {
			fetchOnComplete(cacheData);

			// When fetch policy is only cache-first and gets the data from
			// the cache, it should not perform a request, only when it is
			// cache-and-network.
			if (fetchPolicy === FetchPolicy.CacheFirst) {
				return false;
			}
		}

		dispatchNetworkStatus(status);
		doFetch();
	};

	const doFirstFetch = () => {
		if (!firstRenderRef.current) {
			return;
		}

		maybeFetch(NetworkStatus.Loading);
		firstRenderRef.current = false;
	};

	const dispatchNetworkStatus = (status) => {
		setState({
			error: status === NetworkStatus.Error,
			loading: status < NetworkStatus.Unused,
		});
	}

	useEffect(() => {
		if (!firstRenderRef.current) {
			maybeFetch(NetworkStatus.Refetch);
		}
	}, [debouncedVariablesChange]);

	useEffect(() => {
		return () => {
			// Reset the cache only if the storage reference is
			// local from useResource.
			if (storage[SYMBOL_ORIGIN]) {
				cache.reset();
			}
		};
	}, []);

	return {get: doFirstFetch, resource, resetQueryData, ...state};
};

export {useInfiniteResource};
