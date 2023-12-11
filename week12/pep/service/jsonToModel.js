
import "../domainDoc.js"
import "./restDoc.js"

export { toDeveloper, toProject }

/**
 * A function that maps the json-parsed server-side info of a developer into the
 * client-side representation of a {@link Developer}.
 * @typedef DevMapper
 * @function
 * @param  { RestDeveloper} restDev
 * @param  { Number}        idx     - artificial index (to be improved later)
 * @return { Developer }
 */

/**
 * Curried-style mapping function.
 * @param   { String } imagePath - base path for the image URLs
 * @returns { DevMapper }
 */
const toDeveloper = imagePath => (restDev, idx) => (
    {
        id:   idx, // todo: use proper domain index
        img:  imagePath + (restDev.imageUrl || "imgno.jpg"),
        name: restDev.firstName + " " + restDev.lastName
    }
);

const toProject = jsonProj => (
    {
        id:    jsonProj.id,
        color: jsonProj.color || "black",
        name:  jsonProj.name
    }
);
