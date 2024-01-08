
import "./serviceDoc.js"

export { pepServices }

/** @type Developer[] */
const devs = [
    {id:0, img:"img/img0.jpg", name: "Marie-Claude Federspiel"},
    {id:1, img:"img/img1.jpg", name: "Christian Ribeaud"},
];

/**
 * Concrete factory for local {@link PepService} functions.
 * @constructor
 * @returns {PepService}
 */
const pepServices = () => {

    let assignmentHandler;

    const loadDevelopers = withDevelopers => withDevelopers(devs);

    const run = ({whenReady}) => whenReady();

    const broadcast = command =>
        console.log( "local service does not broadcast.");

    const setAssignmentHandler = newHandler => assignmentHandler = newHandler;

    return {
        run,
        loadDevelopers,
        setAssignmentHandler,
        broadcast
    }
};
