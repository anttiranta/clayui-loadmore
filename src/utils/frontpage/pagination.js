export function concatPagination(existing, incoming) {
    if (typeof existing !== 'object' || typeof incoming !== 'object') {
        throw new TypeError('existing and incoming must be objects');
    }

    const currentData = existing?.data || [];
    let merged = {...incoming};

    if (incoming.data.length + currentData.length <= incoming.total) {
        merged['data'] = currentData.concat(incoming.data);
    } else {
        merged['data'] = currentData;
    }
    return merged;
}
