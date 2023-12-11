// importing all tests that make up the suite of tests that are build on the ES6 module system

// "allTest" suite for both synchronous and asynchronous handling.

import './util/timesTest.js'
import './util/stringsTest.js'
import './church/churchTest.js'
import './church/rockTest.js'

// import './rest/restClientTest.js' // enable if you want to run the async tests that depend on external service availability
import './pep/service/localServiceTest.js'
import './pep/service/jsonToModelTest.js'
import './pep/pepControllerTest.js'
