
import "../domainDoc.js"

/**
 * @callback onDevelopersReadyCallback
 * @param    {!Developer[]} devs - array of developers, might be empty
 * @return   {undefined} void
 */

/**
 * @callback onProjectsReadyCallback
 * @param    {!Project[]} projects - array of projects, might be empty
 * @return   {undefined} void
 */

/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef   PepService
 * @property { (onDevelopersReadyCallback) => void} loadDevelopers - load the developers and call the callback with them
 * @property { (onProjectsReadyCallback)   => void} loadProjects   - load the projects and call the callback with them
 */

