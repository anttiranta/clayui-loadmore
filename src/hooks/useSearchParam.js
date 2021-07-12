/**
 * © 2019 Magento, Inc. <https://magento.com>
 *
 * Licensed under the Academic Free License version 3.0
 * SPDX-License-Identifier: AFL-3.0
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const getSearchParam = (parameter = '', location = window.location) => {
    const params = new URLSearchParams(location.search);
    return params.get(parameter) || '';
};

export const useSearchParam = props => {
    const location = useLocation();
    const { parameter, setValue } = props;
    const value = getSearchParam(parameter, location);

    useEffect(() => {
        setValue(value);
    }, [setValue, value]);
};
