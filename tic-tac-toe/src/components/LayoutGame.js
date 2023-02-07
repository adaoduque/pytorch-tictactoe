import { Component } from 'react';
import TableGame from './TableGame';
import ModalGame from './ModalGame'


class LayoutGame extends Component {

    componentDidMount = () => {}

    render() {
        return (
			<div className="container-fluid">
				<TableGame />
                <ModalGame />
			</div>
        );
    }
}

export default LayoutGame;