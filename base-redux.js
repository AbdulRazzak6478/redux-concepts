import axios from "axios";
import {  createStore ,applyMiddleware ,combineReducers} from "redux";
import logger from 'redux-logger';
import thunk from "redux-thunk";

// action names constant
const init_type = "accounts/init";
const increment_type = "accounts/increment"
const decrement_type = "accounts/decrement"
const multiplyBy10_type = "accounts/multiplyBy10"
const starting_bonus_type ="bonus/initial-bonus-type";
const getUserAccFulFilled = "accounts/getUserFulFilled";
const getUserAccPending= "accounts/getUserPending";
const getUserAccRejected = "accounts/getUserRejected";
//store 
const store = createStore(
    combineReducers({
        accounts:accountsReducer,
        bonus:bonusReducer,
    }),
    applyMiddleware(logger.default,thunk.default));

const history = [];


//reducers

function bonusReducer (state = { points :1},action)
{
    switch(action.type)
    {
        case increment_type:
            return {...state,points:state.points+1}
        case starting_bonus_type:
            if(action.payload >= 35000)
                return {...state, points :state.points + action.payload};
        default : 
            return state;
    }
}
function accountsReducer (state = {amount:1},action){

    switch(action.type)
    {
        case init_type:
            return {...state,amount:action.payload};
        case getUserAccFulFilled:
            return  {...state,amount:action.payload, pending : false};
        case getUserAccPending:
            return  {...state,pending: true};
        case getUserAccRejected:
            return  {...state, error : action.error, pending : false};
        case increment_type:
            return {...state,amount:state.amount+1};
        case decrement_type:
            return {...state,amount:state.amount+1};
        case multiplyBy10_type:
            return {...state,amount:state.amount+1};   
        default:
            return state; 
    }

    // if(action.type === increment_type)
    // {
    //     // state.amount=state.amount+1;
    //     // return state;
    //     // 2 Note : don't change the state directly 
        
    //     // immutability
    //     // return {amount : state.amount+1};  // right one 
    //     return {...state,amount:state.amount+1}
    // }
    // // return action.type === 'decrement' ||action.type === 'multiplyBy10' ? {...state,amount:state.amount-1} :{...state,amount:state.amount*action.payload};
    // if(action.type === decrement)
    // {
    //     return {...state,amount:state.amount-1}
    // }
    // if(action.type === multiplyBy10)
    // {
    //     return {...state,amount:state.amount+action.payload}
    // }

    // return state;
}
//globe state 1
console.log(store.getState() );

// store.subscribe(()=>{
//     history.push(store.getState())
//     console.log(history);
// }) // it is run when the state gets updated

async function getUser(){
    const {data} = await axios.get('http://localhost:3000/accounts/2');
    console.log(data);
}


// action creator
// async function init_action1(dispatch,getState)
// {
//     const {data} = await axios.get('http://localhost:3000/accounts/2');
//     dispatch(initUser(data.amount));
// }
function init_action2(id)
{
    return async (dispatch,getState)=>{
        try{
            dispatch(GetUserAccountPending())
            const {data} = await axios.get(`http://localhost:3000/account/${id}`);
            dispatch(GetUserAccountFulFilled(data.amount));
        }
        catch(error)
        {
            dispatch(GetUserAccountRejected(error.message))
        }
    }
}
function initial_bonus_action(value)
{
    return {type : starting_bonus_type,payload:value};
}
function GetUserAccountFulFilled(value)
{
    return {type : getUserAccFulFilled, payload:value};
}
function GetUserAccountPending()
{
    return {type : getUserAccPending};
}
function GetUserAccountRejected(error)
{
    return {type : getUserAccRejected, error:error};
}
function initUser(value)
{
    // return {type:init_type,payload:value}
    return {type:getUserAccFulFilled,payload:value}
}
function increment_action()
{
    return {type:increment_type};
}
function decrement_action()
{
    return {type:decrement_type};
}
function multiplyByPayload_action(payload)
{
    return {type:multiplyBy10_type,payload};
}
setTimeout(()=>{
    // store.dispatch(init_action1) //for thunk ,pass it as function to recognize
    store.dispatch(init_action2(2))
    console.log("hello world");
    // store.dispatch(increment_action()) //for thunk ,pass it as function to recognize
    // store.dispatch(initial_bonus_action(7500));


},2000)
setInterval(()=>{
    // store.dispatch({type:'increment'});
    // store.dispatch({type:'decrement'});
    // store.dispatch({type:'multiplyBy10',payload:10});
    

    // action creators trigger

    // store.dispatch(init_action())
    // store.dispatch(init_action) //for thunk ,pass it as function to recognize
    // store.dispatch(increment_action());
    // store.dispatch(decrement_action());
    // store.dispatch(multiplyByPayload_action(10));
    
},3000);

// getUser();