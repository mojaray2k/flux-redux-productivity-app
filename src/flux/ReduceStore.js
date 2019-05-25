import {Store} from "./Store";

export class ReduceStore extends Store {
    constructor(dispatcher) {
        super(dispatcher);
        // Keep track of store history
        this.__history = [];
    }

    reduce(state, action) {
        throw new Error("Subclasses must implement reduce method of a Flux ReduceStore");
    }

    __onDispatch(action) {
        const newState = this.reduce(this.__state, action);
        if (newState !== this.__state) {
            // preserve the old state by pushing it into the history array
            this.__history.push(this.__state);
            this.__state = newState;
            this.__emitChange();
        }
    }

    // this will take whatever the latest state in the history and make that the state property
    revertLastState() {
        if (this.__history.length > 0){
            // .pop gets the last state entered into the history array
            this.__state = this.__history.pop();
        }
        // since the state has changed we have to emit change.    
        this.__emitChange();
    }
}
