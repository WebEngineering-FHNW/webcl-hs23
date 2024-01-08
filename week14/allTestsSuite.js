
import { total }      from "./kolibri-dist/src/kolibri/util/test.js";
import { versionInfo} from "./kolibri-dist/src/kolibri/version.js";

import './kolibri-dist/src/allTestsSuite.js';
import './pep/allTestsSuite.js';

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;
