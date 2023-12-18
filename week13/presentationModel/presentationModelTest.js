import { Suite }     from "../test/test.js";
import { Attribute, VALUE, VALID } from "./presentationModel.js";

const pmSuite = Suite("presModel");

pmSuite.add("attr-value", assert => {
    const attr = Attribute("init");
    assert.true(attr.hasObs(VALUE));
    assert.is(attr.hasObs(VALID), false);
    assert.is(attr.getObs(VALUE).getValue(), "init");
    assert.is(attr.getObs(VALID, true).getValue(), true);  // default
    assert.is(attr.hasObs(VALID), true);
});

pmSuite.add("attr-convert", assert => {
    const attr = Attribute("init");
    attr.setConverter(str => str.toUpperCase());
    assert.is(attr.getObs(VALUE).getValue(), "INIT"); // existing value is converted
    attr.setConvertedValue("xxx");               // specialized function: ...
    assert.is(attr.getObs(VALUE).getValue(), "XXX");  // ... converted
    attr.getObs(VALUE).setValue("xxx");               // direct access to observable function: ...
    assert.is(attr.getObs(VALUE).getValue(), "xxx");  // ... does _not_ convert
});

pmSuite.add("attr-valid", assert => {
    const attr = Attribute("init");
    let   valid = undefined;
    attr.getObs(VALID, true).onChange(x => valid = x);
    assert.is(valid, true);
    attr.setValidator( val => val.length > 4);
    assert.is(valid, false);
    attr.setConvertedValue("12345");
    assert.is(valid, true);
});

pmSuite.add("attr-notify", assert => {
    const attr1 = Attribute(".....", "Person.4711.firstname");
    const attr2 = Attribute("Dierk", "Person.4711.firstname");

    assert.is(attr1.getObs(VALUE).getValue(), "Dierk"); // old known values have been updated on init

    attr2.setConvertedValue("Dieter");
    assert.is(attr1.getObs(VALUE).getValue(), "Dieter"); // old known values have been updated on change

    attr1.setConvertedValue("Dierk");
    assert.is(attr2.getObs(VALUE).getValue(), "Dierk"); // and also the other way around

    attr1.setConverter(str => str.toUpperCase());
    assert.is(attr1.getObs(VALUE).getValue(), "DIERK");
    assert.is(attr2.getObs(VALUE).getValue(), "DIERK");

    attr1.setConvertedValue("Dieter");
    assert.is(attr1.getObs(VALUE).getValue(), "DIETER");
    assert.is(attr2.getObs(VALUE).getValue(), "DIETER");

    attr1.getObs(VALID).setValue(false); // create & register the VALID observables
    attr2.getObs(VALID).setValue(false);

    attr2.setValidator( val => val.length > 5);      // "dieter has length 6 and is thus valid"
    assert.is(attr1.getObs(VALID).getValue(), true); // auto- update
    assert.is(attr2.getObs(VALID).getValue(), true);

    attr1.setConvertedValue("Dierk");                 // not valid
    assert.is(attr1.getObs(VALID).getValue(), false);
    assert.is(attr2.getObs(VALID).getValue(), false); // auto-update even though attr1 has no validator !!!

    attr1.setConvertedValue("Dieter");                // conflicting validators
    attr1.setValidator( val => val.length > 6);       // "dieter has length 6 and is thus valid for attr2 but not for attr1"
    assert.is(attr1.getObs(VALID).getValue(), false); // currently, latest change wins but in principle it is unspecified.
    assert.is(attr2.getObs(VALID).getValue(), false);
});

pmSuite.add("setQualifier", assert => {
    const attr1 = Attribute("Dierk", "Person.4711.firstname");
    const attr2 = Attribute(".....", "nothing");

    assert.is(attr1.getObs(VALUE).getValue(), "Dierk"); // old known values have been updated on init
    assert.is(attr2.getObs(VALUE).getValue(), "....."); // old known values have been updated on init

    attr2.setQualifier("Person.4711.firstname");        // setting the qualifier will sync to the exiting values for the qualifier
    assert.is(attr1.getObs(VALUE).getValue(), "Dierk");
    assert.is(attr2.getObs(VALUE).getValue(), "Dierk");

    attr1.setConvertedValue("Dieter");
    assert.is(attr1.getObs(VALUE).getValue(), "Dieter"); // all syncs are now in place
    assert.is(attr2.getObs(VALUE).getValue(), "Dieter");
});

/* Caveat:
It is possible that two Attributes synchronize their values (plus label, valid state, etc.) via qualifier
but they have different converters and validators. In this case, only the converter/validator of the
attribute that received the last setConvertedValue() call is in effect - and the dependent attribute will
experience value changes that might not be in line with its own converter/validation rules.
*/

pmSuite.run();
