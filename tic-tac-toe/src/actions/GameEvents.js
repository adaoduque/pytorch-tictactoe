import { __ENDPOINT__, __STEP__, __NEWGAME__, __SAVEMODEL__ } from '../utils/config'
import { REQUEST_OPTIONS } from '../utils/options'
import { _getPayloadStep, _checkGameState } from '../utils/utils'

export const gameDone = ( mode, prevPlayer, board ) => {
    let state = _checkGameState( mode, prevPlayer, board )
    return {
        type: 'game_done',
        payload: state
    }
}

export const gameStep = (mode, getFromServer, player, action, lastAction) => {
    switch ( mode ) {
        case 1:
            //Mode Player vs IA
            let data  =  null;
            if( getFromServer ) {
                return dispatch => {
                    _gameStepFromServer(mode, player, lastAction, dispatch, "game_done")
                }
            }else {
                data = _getPayloadStep(player, action, "game_done")
                return step( data, null )
            }
        case 4:
            //Mode IA vs IA
            return dispatch => {
                _gameStepFromServer(mode, player, lastAction, dispatch, "game_done")
            }       
        default:
        break;
    }
}

export const newGame = ( mode ) => {
    delete REQUEST_OPTIONS["body"]
    let event = ""
    switch ( mode ) {
        case 1:
            //Mode Player vs IA
            event = "waiting"
        break;
        case 4:
            //Mode IA vs IA
            event = "step"
        break;
        default:
        break;
    }    
    return dispatch => {        
        REQUEST_OPTIONS["method"] = "GET";
        console.log("Event New Game: "+event )
        fetch(__ENDPOINT__+__NEWGAME__, REQUEST_OPTIONS )
            .then((response) => response.json())
            .then(( data ) => {
                let state = {
                    restartGame: "open",
                    startGame: "hidden",
                    event: event
                }
                _newGame(state, dispatch)
            }).catch((error) => {
                console.error(error);
                alert("Ocorreu um problema para consultar o servidor");
            });
    }
}

export const showModal = (show) => {
    return {
        type: 'show_modal',
        payload: show
    };
}

export const changeMode = (mode) => {
    return {
        type: 'change_mode',
        payload: mode
    };
}

export const animateEnd = ( animateValue ) => {
    return {
        type: 'animate_end',
        payload: animateValue
    };
}

export const saveModel = () => {
    delete REQUEST_OPTIONS["body"]
    return dispatch => {        
        REQUEST_OPTIONS["method"] = "GET";
        fetch(__ENDPOINT__+__SAVEMODEL__, REQUEST_OPTIONS )
            .then((response) => response.json())
            .then(( data ) => {
                _saveModel({ saved: true }, dispatch)
            }).catch((error) => {
                console.error(error);
                alert("Ocorreu um problema para consultar o servidor");
            });
    }
}

export const updateTimer = ( seconds, text ) => {
    return {
        type: 'update_timer',
        payload: {
            seconds: seconds,
            text: text
        }
    };
}

const _saveModel = ( data, dispatch ) => {
    console.log("Salvo com sucesso.");
    dispatch({
        type: 'save_model',
        payload: data
    });
}

const _newGame = ( data, dispatch ) => {
    dispatch({
        type: 'new_game',
        payload: data
    });
}

const step = ( data, dispatch ) => {
    if( dispatch === null ) {
        return {
            type: 'step',
            payload: data
        }
    }else {
        dispatch({
            type: 'step',
            payload: data,
        });
    }
}

const _gameStepFromServer = (mode, player, lastAction, dispatch, event) => {
    let body = JSON.stringify({ 
        mode: mode,
        player: player,
        last_action: lastAction
    });

    REQUEST_OPTIONS["method"] =  "POST";
    REQUEST_OPTIONS["body"]   =  body
    fetch(__ENDPOINT__+__STEP__, REQUEST_OPTIONS )
    .then((response) => response.json())
    .then(( response ) => {
        let action  =  response["action"]
        let data    =  _getPayloadStep(player, action, event)
        step(data, dispatch);
    }).catch((error) => {
        console.error(error);
        alert("Ocorreu um problema para consultar o servidor");
    })
}