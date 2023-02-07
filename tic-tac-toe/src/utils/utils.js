const _checkGameIsDone = ( player, board ) => {

    let t0  =  board[0];
    let t1  =  board[1];
    let t2  =  board[2];
    let t3  =  board[3];
    let t4  =  board[4];
    let t5  =  board[5];
    let t6  =  board[6];
    let t7  =  board[7];
    let t8  =  board[8];
    let response = {
        'done': true,
        'adversary_play': true,
        'winner_direction': -1
    };    

    if ( t0 === player && t1 === player && t2 === player ) {
        response["winner_direction"] = 0
    }else if ( t3 === player && t4 === player && t5 === player ) {
        response["winner_direction"] = 1
    }else if ( t6 === player && t7 === player && t8 === player ) {
        response["winner_direction"] = 2
    }else if ( t0 === player && t3 === player && t6 === player ) {
        response["winner_direction"] = 3
    }else if ( t1 === player && t4 === player && t7 === player ) {
        response["winner_direction"] = 4
    }else if ( t2 === player && t5 === player && t8 === player ) {
        response["winner_direction"] = 5
    }else if ( t0 === player && t4 === player && t8 === player ) {
        response["winner_direction"] = 6
    }else if ( t2 === player && t4 === player && t6 === player ) {
        response["winner_direction"] = 7
    }else {        
        response["adversary_play"] = false

        for( let i in board ) {
            if( board[i] === "" ) {
                response["done"] = false
                break;
            }
        }
    }
    return response
}

export const _checkGameState = (mode, player, board) => {
    let response =  _checkGameIsDone(player, board)
    let event    =  ""
    switch( mode ) {
        case 1:
            if( player === "O" && !response["done"] ) {
                event =  "step";
            }else {
                event =  "waiting";
            }            
        break;
        case 4:
            if( !response["done"] ) {
                event =  "step";
            }else {
                event =  "waiting_10_seconds";
            }
        break;        
        default:
        break;
    }
    return {
        event: event,
        done: response["done"],
        winner_direction: response["winner_direction"],
        adversary_play: response["adversary_play"]        
    }
}

export const _getPayloadStep = (player, action, event) => {    
    return {
        player: player,
        action: action,
        event: event  
    }
}