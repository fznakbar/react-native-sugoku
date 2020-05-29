import { createStore } from 'redux'

const defaultState = {
    leaderBoard : [
    {
        name : 'Donald Trump',
        time : 635
    },
    //DUMMY DATA FOR TESTING PURPOSE ONLY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // {
    //     name : 'Toni Stark',
    //     time : 700
    // },
    // {
    //     name : 'John Cena',
    //     time : 500
    // },
    // {
    //     name : 'Captain America',
    //     time : 598
    // }
    // DUMMY DATA FOR TESTING PURPOSE ONLY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    ]
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_LEADERBOARD':
            // console.log('reducer')
            let newLeaderBoard = state.leaderBoard.concat(action.payload)
            return {...state, leaderBoard : newLeaderBoard}
    
        default:
            return state
    }
}

const store = createStore(reducer)

export default store