import {client}      from "../../kolibri-dist/src/kolibri/rest/restClient.js";
import {toDeveloper} from "./jsonToModel.js";
import                    "./serviceDoc.js"

export { pepServices }

/**
 * Concrete factory for remote, asynchronous {@link PepService} functions.
 * @returns {PepService}
 */
const pepServices = (URL, imagePath) => {

    let _broadcastHandler;
    let assignmentHandler;

    /**
     * Uses parameter object pattern to deal with the many different options that
     * various service factories might need.
     */
    const run = ({stompClient, channel, broadcastHandler, whenReady}) => {
        _broadcastHandler = broadcastHandler;
        console.log("start listening", channel, stompClient);
        stompClient.connect({},  () => {
            console.log("subscribing for channel", channel);
            stompClient.subscribe(channel, payload =>  {
                console.log("processing message: ",payload.body);

                // take the payload and see whether we have to update any model
                // for the moment we can assume that we only have to care about assignments
                const assignment = JSON.parse(payload.body);
                assignmentHandler && assignmentHandler(assignment);

            });
            whenReady();
        });
    };

    const loadDevelopers = withDevelopers =>
        client(URL)
        .then(json => {
            // console.log("All devs:", JSON.stringify(json));
            const devs = json.map( toDeveloper(imagePath) );
            withDevelopers(devs);
        })
        .catch( err => console.error(err));

    const setAssignmentHandler = newHandler => assignmentHandler = newHandler;

    const broadcast = command => {
        console.log("broadcasting: ", command);
        _broadcastHandler(command);
    };

    return {
        run,
        loadDevelopers,
        setAssignmentHandler,
        broadcast
    }
};

