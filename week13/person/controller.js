/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }       from "../observable/observable.js";
import {reset, Person, ALL_ATTRIBUTE_NAMES} from "./person.js"

export { ListController, SelectionController }

const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};

const noSelection = reset(Person());
ALL_ATTRIBUTE_NAMES.forEach( attrName =>
    noSelection[attrName].setQualifier("Person.none."+attrName)
);

const SelectionController = model => {

    const selectedModelObs = Observable(model);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected  : selectedModelObs.onChange,
        clearSelection   : () => selectedModelObs.setValue(noSelection),
    }
};
