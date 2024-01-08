import { pepServices }  from "./localService.js"
import { TestSuite }    from "../../kolibri-dist/src/kolibri/util/test.js";

const localServiceSuite = TestSuite("localService");

localServiceSuite.add("setup", assert => {

    pepServices().loadDevelopers( devs => {
        assert.is(devs.length, 2);
    })

});

localServiceSuite.run();
