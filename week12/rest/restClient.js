export { client }

/**
 * A client for REST-like communication.
 * @param   {!String} url            - Uniform Resource Locator of the endpoint. Mandatory.
 * @param   {String}  [method="GET"] - The REST method, one of GET, POST, PUT, DELETE, HEAD, OPTION. Defaults to GET.
 * @param   {?Object} [data=null]    - Optional data in case the method (e.g. POST, PUT) demands it. Will be stringified.
 * @returns {Promise<any>}           - object as data structure or error text or status text
 * @example
 * client('https://jsonplaceholder.typicode.com/todos/1')
 *    .then( data => console.log(data) )
 *    .catch( err => console.error(err) );
 */
const client = (url, method = 'GET', data = null) => {
    const request = {
        method: method,                  // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin',             // no-cors, *cors, same-origin
        cache: 'no-cache',               // no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',      // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    };
    if (null != data) {
        request.body = JSON.stringify(data);
    }
    return fetch(url, request)
        .then(resp => {                             // fetch API cares for the general error handling
            if (204 === Number(resp.status)) {
                console.log("got special", 204);    // special: Grails returns this on successful DELETE
                return Promise.resolve("ok");
            }
            if (resp.ok) {
                return resp.json()
            }
            if (Number(resp.status) < 400) {
                console.log("status", resp.status);
                return Promise.reject(resp.text()); // TODO: unclear if reject or resolve is better (eg. redirect)
            }
            return Promise.reject(resp.status);
        })
};
