
import { pepServices } from "./service/localService.js";
import { start }  from "./pep.js";

const appRootId = window.appRootId;

const services = pepServices();

services.run({
    whenReady: () => services.loadDevelopers( devs => start(services, appRootId, devs) )
});
