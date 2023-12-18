import {Attribute, LABEL, VALUE} from "../presentationModel/presentationModel.js";
import {formProjector, listItemProjector, selectListItemForModel, removeListItemForModel, pageCss} from "./instantUpdateProjector.js";
import {EDITABLE} from "../presentationModel/presentationModel.js";

export { MasterView, DetailView, Person, selectionMold, reset, ALL_ATTRIBUTE_NAMES }

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname', 'birthday'];

let idCounter = 0;
const nextId = () => idCounter++;

const Person = () => {                               // facade
    const id = nextId();
    const firstnameAttr = Attribute("Monika", `Person.${id}.firstname`);
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann", `Person.${id}.lastname`);
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    const birthdayAttr  = Attribute("1968-04-19", `Person.${id}.birthdate`);
    birthdayAttr.getObs(LABEL).setValue("Birthday");

    lastnameAttr.setConverter( input => input.toUpperCase() );  // enable for playing around
    lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
        birthday:           birthdayAttr,
        toString: () => firstnameAttr.getObs(VALUE).getValue() + " " + birthdayAttr.getObs(VALUE).getValue(),
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {

    const render = person =>
        listItemProjector(listController, selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    // binding
    listController.onModelAdd(render);
    listController.onModelRemove( (removedModel, removeMe) => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES)(removedModel);
        ALL_ATTRIBUTE_NAMES.forEach( attrName =>           // remove model attributes from model world
            removedModel[attrName].setQualifier(undefined)
        );
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES));
};

const reset = person => {
    ALL_ATTRIBUTE_NAMES.forEach(propertyName => {
        person[propertyName].setConvertedValue("");
        person[propertyName].getObs(EDITABLE).setValue(false);
        person[propertyName].setQualifier(undefined);
    });
    return person;
};

const selectionMold = reset(Person());

const DetailView = (selectionController, rootElement) => {

    formProjector(selectionController, rootElement, selectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected( selectedModel =>
        ALL_ATTRIBUTE_NAMES.forEach(attrName =>
            selectionMold[attrName].setQualifier(selectedModel[attrName].getQualifier())));
};
