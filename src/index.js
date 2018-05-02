import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css';

class Game extends React.Component {

    /*
    Beginner: 10 mines, 8x8 board
    Intermediate: 20 mines, 12x12 board
    Expert: 40 mines, 16x16 board
    */
    state = {
        height: 8,
        width: 8,
        mines: 10,
    };

    handleGameStart = () => {
        let difficulty = document.querySelector("#level_select");
        if (difficulty.value === "beginner") {
            this.setState({
                height: 8,
                width: 8,
                mines: 10,
            });
        }
        if (difficulty.value === "intermediate") {
            this.setState({
                height: 12,
                width: 12,
                mines: 20,
            });
        }
        if (difficulty.value === "expert") {
            this.setState({
                height: 16,
                width: 16,
                mines: 40,
            });
        }
    }

    render() {
        const { height, width, mines } = this.state;
        return (
            <div className="game">
                <div className="game-info">
                    <div className="instructions">
                        <h4>Rules</h4>
                        <p>You are presented with a board of squares. Some squares contain mines (bombs), others don't. If you click on a square containing a bomb, you lose. If you manage to click all the squares (without clicking on any bombs) or flag all the mines, you win.</p>
                        <p>Clicking a square which doesn't have a bomb reveals the number of neighbouring squares containing bombs. Use this information plus some guess work to avoid the bombs.</p>
                        <p>To open a square, point at the square and click on it. To mark a square you think is a bomb, point and right-click.</p>
                    </div>
                    <h4>Select a level a click "start"</h4>
                    <span className="info">Level:
                        <select id="level_select">
                            <option value="beginner"> Beginner </option>
                            <option value="intermediate"> Intermediate </option>
                            <option value="expert"> Expert </option>
                        </select>
                    </span>
                    <button onClick={this.handleGameStart}>Start</button>
                </div>

                <Board height={height} width={width} mines={mines} />
                
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));
