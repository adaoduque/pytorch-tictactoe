import { Component } from 'react';
import { connect } from 'react-redux';
import { gameStep, newGame, showModal, changeMode, animateEnd, gameDone, saveModel, updateTimer } from './../actions/GameEvents'
import { Form, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';

const mapStateToProps = state => ({
    text: state.ReducerGame.text,
    seconds: state.ReducerGame.seconds,
    player: state.ReducerGame.currentPlayer,
    restartGame: state.ReducerGame.class.restartGame,
    startGame: state.ReducerGame.class.startGame,
    action_adversary: state.ReducerGame.action_adversary,
    winner_path: state.ReducerGame.winner_path,
    winner: state.ReducerGame.winner,
    done: state.ReducerGame.done,
    mode: state.ReducerGame.mode,
    getFromServer: state.ReducerGame.getFromServer,
    animate: state.ReducerGame.animate,
    lastAction: state.ReducerGame.lastAction,
    nextEvent: state.ReducerGame.nextEvent,
    board: state.ReducerGame.table,
    t_1: state.ReducerGame.table[1],
    t_2: state.ReducerGame.table[2],
    t_3: state.ReducerGame.table[3],
    t_4: state.ReducerGame.table[4],
    t_5: state.ReducerGame.table[5],
    t_6: state.ReducerGame.table[6],
    t_7: state.ReducerGame.table[7],
    t_8: state.ReducerGame.table[8],
});

const _STYLE_ = {
    "strokeDasharray": 200, 
    "strokeDashoffset": 0
}

class TableGame extends Component {

    constructor() {
        super();
        this.timer = 0;
        this.countDown = this._countDown.bind(this);
    }    

    componentDidMount = () => {}

    componentWillUnmount = () => {}

    componentDidUpdate = (prevProps) => {
        let nextEvent  =  this.props.nextEvent
        console.log( "NextEvent: "+ nextEvent )
        if( nextEvent === "game_done" ) {
            let pPlayer =  prevProps.player
            let board   =  this.props.board
            setTimeout(() => {
                let mode   =  this.props.mode
                this.props.gameDone(mode, pPlayer, board)
            }, 2000);
        }else if( nextEvent === "step" ) {
            let player  =  this.props.player
            setTimeout(() => {
                this._playStep(player, null, true)
            }, 1000);
        }else if( nextEvent === "waiting_10_seconds" ) {
            this.timer = setInterval(this.countDown, 0);
        }
    }

    _countDown() {
        let seconds = this.props.seconds - 1;
        console.log( "seconds: "+seconds )
        if (seconds < 0) {            
            clearInterval(this.timer);
            this._newGame()
        }else {
            let text = "Partida reiniciando em: "+seconds+"s"
            this._updateTimer( seconds, text )
        }
    }

    _updateTimer = ( seconds, text ) => {
        this.props.updateTimer( seconds, text )
    }

    _playStep = (player, action, getFromServer) => {
        let mode   =  this.props.mode                
        let lastAction = this.props.lastAction
        if( this.props.done ) {
            this.props.showModal(true);
        }else {
            this.props.gameStep(mode, getFromServer, player, action, lastAction);
        }
    }

    _showModal = () => {
        this.props.showModal();
    }

    _newGame = () => {
        let mode   =  this.props.mode
        this.props.newGame(mode);
    }

    _changeMode = (e) => {
        let elem     =  e.target;
        let mode     =  elem.options[elem.selectedIndex].value;
        this.props.changeMode( mode );
    }

    _onAnimateEnd = () => {
        this.props.animateEnd( '' );
    }

    _onWinner = () => {
        this.props.animateEnd( '' );
    }

    render() {
        return (
            <div className="col-12">
                <div className="container-player">                  
                    <div className="row">
                        <Form.Group controlId="formGridState" style={{ 'width': '100%' }}>
                            <Form.Label className="color-white outline-success">Modo</Form.Label>
                            <Form.Control variant="outline-success" as="select" value={this.props.mode} onChange={(e) => this._changeMode(e)}>
                                <option value="1">IA</option>
                                <option value="2">Multiplayer</option>
                                <option value="3">Train</option>
                                <option value="4">IA vs IA</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="row">
                        <ToggleButtonGroup type="checkbox" value={1} style={{ 'width': '100%' }}>
                            <ToggleButton variant={this.props.player === "X" ? "dark" : "outline-dark" } value='1'>X</ToggleButton>
                            <ToggleButton variant={this.props.player === "X" ? "outline-dark" : "dark" } value='2'>O</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <span className="container-player-vez color-white">Vez de: {this.props.player}</span>
                </div>
                <div className="col-12 relative">
                    <div className="container-svg">
                        <svg className='svg' viewBox="0 0 400 330">
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M200,110L6,110" style={_STYLE_}></path>
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M200,110L395,110" style={_STYLE_}></path>

                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M200,220L6,220" style={_STYLE_}></path>
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M200,220L395,220" style={_STYLE_}></path>
                            
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M133,165L133,6" style={_STYLE_}></path>
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M133,165L133,326" style={_STYLE_}></path>
                        
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M267,165L267,6" style={_STYLE_}></path>
                            <path className={"path "+this.props.animate} onAnimationEnd={() => this._onAnimateEnd()} d="M267,165L267,326" style={_STYLE_}></path>

                            <path className={"path "+this.props.winner_path[0]} onAnimationEnd={() => this._onWinner()} d="M3,58L396,58" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>
                            <path className={"path "+this.props.winner_path[1]} onAnimationEnd={() => this._onWinner()} d="M3,168L396,168" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>
                            <path className={"path "+this.props.winner_path[2]} onAnimationEnd={() => this._onWinner()} d="M3,278L396,278" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>

                            <path className={"path "+this.props.winner_path[3]} onAnimationEnd={() => this._onWinner()} d="M67,10L67,326" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>
                            <path className={"path "+this.props.winner_path[4]} onAnimationEnd={() => this._onWinner()} d="M200,10L200,326" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>
                            <path className={"path "+this.props.winner_path[5]} onAnimationEnd={() => this._onWinner()} d="M334,10L334,326" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>

                            <path className={"path "+this.props.winner_path[6]} onAnimationEnd={() => this._onWinner()} d="M38,33L370,305" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>
                            <path className={"path "+this.props.winner_path[7]} onAnimationEnd={() => this._onWinner()} d="M358,38L33,302" style={{ "strokeDasharray": 700, "strokeDashoffset": 0}}></path>

                        </svg>
                    </div>
                    <table className="table-game">
                        <tbody>
                            <tr>
                                <td onClick={() => this._playStep(this.props.player, 0, false)}>
                                    <span className={this.props.board[0] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[0]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 1, false)}>
                                    <span className={this.props.board[1] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[1]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 2, false)}>
                                    <span className={this.props.board[2] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[2]}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td onClick={() => this._playStep(this.props.player, 3, false)}>
                                    <span className={this.props.board[3] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[3]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 4, false)}>
                                    <span className={this.props.board[4] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[4]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 5, false)}>
                                    <span className={this.props.board[5] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[5]}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td onClick={() => this._playStep(this.props.player, 6, false)}>
                                    <span className={this.props.board[6] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[6]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 7, false)}>
                                    <span className={this.props.board[7] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[7]}
                                    </span>
                                </td>
                                <td onClick={() => this._playStep(this.props.player, 8, false)}>
                                    <span className={this.props.board[8] === "X" ? "span-game-x" : "span-game-o"}>
                                        {this.props.board[8]}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="container-player">
                    <div>
                        <Button className={"container-player-reiniciar "+this.props.restartGame} onClick={() => { this._newGame() }} variant="dark" size="lg" active>
                            {this.props.text}
                        </Button>
                    </div>
                    <div>
                        <Button className={"container-player-novojogo "+this.props.startGame} onClick={() => { this._newGame() }} variant="dark" size="lg" active>
                            Nova Partida
                        </Button>
                    </div>
                    <div style={{ "marginTop": "10px", "float": "left" }}>
                        <Button className={"container-player-novojogo "} onClick={() => { this.props.saveModel() }} variant="blue" size="lg" active>
                            Salvar modelo
                        </Button>
                    </div>                    
                </div>                
            </div>
        );
    }
}

export default connect(mapStateToProps, {gameStep, newGame, showModal, changeMode, animateEnd, gameDone, saveModel, updateTimer})(TableGame);