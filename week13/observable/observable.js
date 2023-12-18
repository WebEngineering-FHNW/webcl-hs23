
export {Observable, ObservableList}

/**
 * @callback onValueChangeCallback<T>
 * @template T
 * @impure   this callback usually modifies the MVC view
 * @param    {T} newValue   - the new value that is set by the change
 * @param    {T} [oldValue] - the old value before the change. Can optionally be used by the callback.
 * @return   void
 */

/**
 * IObservable<T> is the interface from the GoF Observable design pattern.
 * In this variant, we allow to register many observers but do not provide means to unregister.
 * Observers are not garbage-collected before the observable itself is collected.
 * IObservables are intended to be used with the concept of "stable binding", i.e. with
 * listeners that do not change after setup.
 * @typedef IObservable<T>
 * @template T
 * @impure   Observables change their inner state (value) and maintain a list of observers that changes over time.
 * @property { ()  => T }   getValue - a function that returns the current value
 * @property { (T) => void} setValue - a function that sets a new value, calling all registered {@link onValueChangeCallback}s
 * @property { (callback: onValueChangeCallback<T>) => void } onChange -
 *              a function that registers an {@link onValueChangeCallback} that will be called whenever the value changes.
 *              Immediately called back on registration.
 */

/**
 * Constructor for an IObservable<T>.
 * @pure
 * @template T
 * @param    {!T} value      - the initial value to set. Mandatory.
 * @returns  IObservable<T>
 * @constructor
 * @example
 * const obs = Observable("");
 * obs.onChange(val => console.log(val));
 * obs.setValue("some other value");
 */
const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            if (listeners.length > 3) {
                console.debug("log listener count suspicious: ", listeners.length);
            }
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item));
            return item;
        },
        del: item => {
            const r = listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
