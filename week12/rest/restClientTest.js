import {client} from "./restClient.js";
import {Suite}  from "../test/test.js";

const restClientSuite = Suite("restClient");

restClientSuite.add("todoService", assert => {
    // will run async - out of order
    client('https://jsonplaceholder.typicode.com/todos/1')
        .then(json => console.error("Test FAILED: must not reach here!"))   // must not reach here
        .catch(err => console.log("Test OK if log contains HTTP Error.") ); // expected to fail because of same-origin mismatch
    assert.is(true, true);                     // just to indicate that we executed the test
});

restClientSuite.run();
