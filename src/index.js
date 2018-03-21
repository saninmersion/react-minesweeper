import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css';

class Game extends React.Component {

    /*
    Beginner: 10 mines, 8x8 board
    Intermediate: 40 mines, 16x16 board
    Expert: 99 mines, 16x30 board
    */
    state = {
        height: 16,
        mines: 40,
        width: 16,
    };

    render() {
        const {height, width, mines} = this.state;
        return (
            <div className="game">
                <Board height={height} width={width} mines={mines}/>
            </div>
        );
    }
}

ReactDOM.render(<Game/>, document.getElementById('root'));
