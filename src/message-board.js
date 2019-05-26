import { createStore, combineReducers } from 'redux';

// Define constants
export const ONLINE = `ONLINE`;
export const AWAY = `AWAY`;
export const BUSY = `BUSY`;
export const OFFLINE = `OFFLINE`;
export const CREATE_NEW_MESSAGE = `CREATE_NEW_MESSAGE`;

export const UPDATE_STATUS = `UPDATE_STATUS`;


const defaultState = {
    messages: [{
        date:new Date('2016-10-10 10:11:55'),
        postedBy:`Stan`,
        content:`I <3 the new productivity app!`
    },{
        date:new Date('2016-10-10 10:12:00'),
        postedBy:`Jerry`,
        content:`I don't know if the new version of Bootstrap is really better...`
    },{
        date:new Date('2016-10-10 12:06:04'),
        postedBy:`Llewlyn`,
        content:`Anyone got tickets to ng-conf?`
    }],
    userStatus: ONLINE
}

// Reducers take two arguments (state) and ({action}).
// The value of state is initially set to the defaultState
// The action is ({destructured}) to ({type}) and ({value})
/* const reducer = (state = defaultState, {type, value}) => {
    switch(type){
        case UPDATE_STATUS:
            // Copy the state where the userStatus is the value of the action
            return { ...state, userStatus:value};
            break;
    }
    return state;
} */

const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
    switch(type){
        case UPDATE_STATUS:
            return value;
            break;
    }

    return state;
}

const messageReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch(type){
        case CREATE_NEW_MESSAGE:
            const newState = [{date, postedBy, content:value}, ... state]
            return newState;
    }

    return state;
}

const combineReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messageReducer
});

const store = createStore(combineReducer);

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById("messages").innerHTML = messages
        .sort((a,b) => b.date - a.date)
        .map(message => (`
            <div>
                ${message.postedBy} : ${message.content}
            </div>
        `)).join("");
        // If the user status is offline then the input for the message is disabled
        document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
        document.forms.newMessage.newMessage.value = "";
}


const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}

const newMessageAction = (content, postedBy)=>{
    const date = new Date();

    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}

// When the form is changed we want to dispatch a user status change action
document.forms.selectStatus.status.addEventListener("change", (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

document.forms.newMessage.addEventListener("submit",(e)=>{
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage[`preferences`] ? JSON.parse(localStorage[`preferences`]).userName : "Jim";
    store.dispatch(newMessageAction(value, username));
});

render();

store.subscribe(render);
