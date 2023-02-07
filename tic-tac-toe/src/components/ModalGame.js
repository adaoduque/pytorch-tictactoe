import { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { showModal, newGame } from './../actions/GameEvents'

const mapStateToProps = state => ({
    show: state.ReducerGame.showModal,
});


class ModalGame extends Component {

    componentDidMount = () => {}

    close = () => {
        console.log("Clicou")
        this.props.showModal(false)
    }

    open = () => {
        this.props.showModal(true)
    }
    
    _newGame = () => {
        this.props.newGame()
    }    

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.close}
                backdrop="static"
                animation={true}
                keyboard="True" >
                <Modal.Header closeButton>
                    <Modal.Title>Erro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Inicie a partida antes de tentar jogar
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary"
                        onClick={() => { this._newGame() }}>
                        Entendi e iniciar partida já!
                    </Button>
                    <Button variant="secondary" 
                        onClick={() => { this.close() }}>
                        Fechar
                    </Button>                    
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, { showModal, newGame })(ModalGame);