import {client}                 from "../../rest/restClient.js";
import {toDeveloper, toProject} from "./jsonToModel.js";
import                               "./serviceDoc.js"
import                               "./restDoc.js"

export { pepServices }

/**
 * Concrete factory for remote, asynchronous {@link PepService} functions.
 * @returns {PepService}
 */
const pepServices = (URL, imagePath) => {

    const loadDevelopers = withDevelopers =>
        client(URL)
        .then( /** @type Array<RestDeveloper> */ restDevArray => {
            const devs = restDevArray.map( toDeveloper(imagePath) );
            withDevelopers(devs);
        })
        .catch( err => console.error(err));

    const loadProjects = withProjects =>
        client(URL)
        .then(json => withProjects(json.map(toProject)))
        .catch( err => console.error(err));

    return { loadDevelopers, loadProjects }
};

