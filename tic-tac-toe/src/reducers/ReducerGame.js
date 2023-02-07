const INITIAL_STATE = {
    class: {
        restartGame: "hidden",
        startGame: "open",
    },
    action : {
        step: {
            directionWinner: 0,
        }
    },
    seconds: 0,
    nextEvent: null,
    showModal: false,
    currentPlayer: "O", // Current player to play
    done: true, // Game is done ?
    mode: 1, //1 - Mode VS IA
    action_adversary: null,
    text: "Reiniciar Partida",
    animate: 'animate-path',
    winner: "",    
    getFromServer: false,
    lastAction: null,
    alertSaveModel: false,
    winner_path: {
        0: 'hidden',
        1: 'hidden',
        2: 'hidden',
        3: 'hidden',
        4: 'hidden',
        5: 'hidden',
        6: 'hidden',
        7: 'hidden'
    },
    table: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
    }
}

const reducer = (state=INITIAL_STATE, action) => {
    switch ( action.type ) {
        case 'game_done':
            let done    =  action.payload.done
            let dWin    =  action.payload.winner_direction
            let adPlay  =  action.payload.adversary_play
            let evt     =  action.payload.event
            let wipath  =  {
                0: 'hidden',
                1: 'hidden',
                2: 'hidden',
                3: 'hidden',
                4: 'hidden',
                5: 'hidden',
                6: 'hidden',
                7: 'hidden'
            }

            if( done && dWin >= 0 ) {
                wipath[dWin]  =  'animate-path2'
            }

            return {
                ...state,
                seconds: 10,
                done: done,
                winner_path: wipath,
                nextEvent: evt,
                alertSaveModel: false,
                adversary_play: adPlay

            }
        case 'step':
            let player   =  action.payload.player
            let pAction  =  action.payload.action
            let event    =  action.payload.event

            let table =  {
                0: state.table[0],
                1: state.table[1],
                2: state.table[2],
                3: state.table[3],
                4: state.table[4],
                5: state.table[5],
                6: state.table[6],
                7: state.table[7],
                8: state.table[8]
            }

            table[pAction] = player;

            return {
                ...state,
                currentPlayer: player === "X" ? "O" : "X",
                lastAction: pAction,
                nextEvent: event,
                alertSaveModel: false,
                table: table         
            }
        case 'new_game':
            return {
                ...state,
                class: {
                    restartGame: action.payload.restartGame,
                    startGame: action.payload.startGame,
                },
                currentPlayer: "O",
                showModal: false,
                done: false,
                animate: 'animate-path',
                winner: "",
                text: "Reiniciar Partida",
                directionWinner: 0,
                action_adversary: null,
                nextEvent: action.payload.event,
                alertSaveModel: false,
                winner_path: {
                    0: 'hidden',
                    1: 'hidden',
                    2: 'hidden',
                    3: 'hidden',
                    4: 'hidden',
                    5: 'hidden',
                    6: 'hidden',
                    7: 'hidden',
                    8: 'hidden',
                },
                table: {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: '',
                }                
            }
        case 'show_modal':
            return {
                ...state,
                alertSaveModel: false,
                nextEvent: null,
                showModal: action.payload
            }
        case 'change_mode':
            return {
                ...state,
                class: {
                    restartGame: "hidden",
                    startGame: "open"
                },
                mode: parseInt( action.payload ),
                animate: 'animate-path',
                showModal: false,
                done: true,
                winner: "",
                action_adversary: null,
                alertSaveModel: false,
                nextEvent: null,
                winner_path: {
                    0: 'hidden',
                    1: 'hidden',
                    2: 'hidden',
                    3: 'hidden',
                    4: 'hidden',
                    5: 'hidden',
                    6: 'hidden',
                    7: 'hidden',
                    8: 'hidden',
                },
                table: {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: '',
                }                
            }    
        case 'animate_end':
            return {
                ...state,
                animate: action.payload,
                nextEvent: null,
                alertSaveModel: false
            }
        case 'save_model':
            return {
                ...state,
                nextEvent: null,
                alertSaveModel: true
            }
        case 'update_timer':
            return {
                ...state,
                seconds: action.payload.seconds,
                text: action.payload.text
            }
        default:
            return state;
    }    
}

export default reducer