import React, {useMemo, useContext} from 'react';
import {LRUCache} from "@clayui/data-provider/lib/LRUCache";
import {SYMBOL_DATA_PROVIDER, SYMBOL_ORIGIN} from "@clayui/data-provider/lib/types";

const defaultContext = {
    cache: {
        [SYMBOL_DATA_PROVIDER]: new LRUCache(),
        [SYMBOL_ORIGIN]: true,
    }
};

const ApiContext = React.createContext();

const ApiContextProvider = ({
         context = defaultContext,
         children
    }) => {

    const contextValue = useMemo(() => context, [context])

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export {ApiContext, ApiContextProvider};

export const useApiContext = () => useContext(ApiContext);