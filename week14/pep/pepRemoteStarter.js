
import { pepServices } from "./service/remoteService.js";
import { start }       from "./pep.js";

// use data as provided from view through the window object:
const URL   = `http://${grailsServerName}:${grailsServerPort}${restPath}`;
const appRootId = window.appRootId;

const channel  = window.webStompChannel;
const endpoint = window.webStompEndPoint;
const client   = window.webStompClient;

const services = pepServices(URL, "/static/pep/img/");

services.run ({
    stompClient:      client,
    channel:          channel,
    broadcastHandler: command => client.send(endpoint, JSON.stringify(command)),
    whenReady:        ()      => services.loadDevelopers( devs => start(services, appRootId, devs))
});




