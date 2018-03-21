import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    state = {
        boardData: this.initBoardData(),
        gameWon: false,
        mineCount: this.props.mines,
    };

    /* Helper Functions */

    // Gets initial board data
    initBoardData() {
        let data = [];

        for (let i = 0; i < this.props.height; i++) {
            for (let j = 0; j < this.props.width; j++) {
                data.push(
                    {
                        x: i,
                        y: j,
                        isMine: false,
                        neighbour: 0,
                        isRevealed: false,
                        isEmpty: false,
                        isFlagged: false,
                    }
                );
            }
        }
        data = this.plantMines(data);
        data = this.getNeighbours(data);
        return data;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // plant mines on the board
    plantMines(data) {
        let random, minesPlanted = 0;
        const dimension = this.props.width * this.props.height;

        while (minesPlanted < this.props.mines) {
            random = this.getRandomNumber(dimension);
            if (!(data[random].isMine)) {
                data[random].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(value => {
            if (value.isMine) {
                mineArray.push(value);
            }
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(value => {
            if (value.isFlagged) {
                mineArray.push(value);
            }
        });

        return mineArray;
    }

    // get Flags
    getHidden(data) {
        let mineArray = [];

        data.map(value => {
            if (!value.isRevealed) {
                mineArray.push(value);
            }
        });

        return mineArray;
    }

    // get number of neighbouring mines for each board cell
    getNeighbours(data) {
        let updatedData = data, index = 0;

        for (let i = 0; i < this.props.height; i++) {
            for (let j = 0; j < this.props.width; j++) {
                if (data[index].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[index].x, data[index].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[index].isEmpty = true;
                    }
                    updatedData[index].neighbour = mine;
                }
                index++;
            }
        }

        return (updatedData);
    };

    // resolve two dimensional board index to one dimension
    resolveIndex(x, y) {
        return (x * this.props.height + y);
    }

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[this.resolveIndex(x - 1, y)]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[this.resolveIndex(x + 1, y)]);
        }

        //left
        if (y > 0) {
            el.push(data[this.resolveIndex(x, y - 1)]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[this.resolveIndex(x, y + 1)]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[this.resolveIndex(x - 1, y - 1)]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[this.resolveIndex(x - 1, y + 1)]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[this.resolveIndex(x + 1, y + 1)]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[this.resolveIndex(x + 1, y - 1)]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((value) => {
            value.isRevealed = true;
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[this.resolveIndex(value.x, value.y)].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    handleCellClick(x, y) {
        let win = false;

        // check if revealed. return if true.
        if (this.state.boardData[this.resolveIndex(x, y)].isRevealed) return null;

        // // check if mine. game over if true
        if (this.state.boardData[this.resolveIndex(x, y)].isMine) {
            this.revealBoard();
            alert("game over");
        }
        let updatedData = this.state.boardData;
        updatedData[this.resolveIndex(x, y)].isFlagged = false;
        updatedData[this.resolveIndex(x, y)].isRevealed = true;

        if (updatedData[this.resolveIndex(x, y)].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if(this.getHidden(updatedData).length === this.props.mines) {
            win = true;
            this.revealBoard();
            alert("You Win");
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
            gameWon: win,
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;
        let win = false;

        // check if already revealed
        if (updatedData[this.resolveIndex(x, y)].isRevealed) return;

        if (updatedData[this.resolveIndex(x, y)].isFlagged) {
            updatedData[this.resolveIndex(x, y)].isFlagged = false;
            mines++;
        } else {
            updatedData[this.resolveIndex(x, y)].isFlagged = true;
            mines--;
        }

        if (mines === 0){
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            win = (JSON.stringify(mineArray) === JSON.stringify(FlagArray));
            if (win) {
                this.revealBoard();
                alert("You Win");
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
            gameWon: win,
        });
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">mines: {this.state.mineCount}</span><br />
                    <span className="info">{this.state.gameWon ? "You Win" : "" }</span>
                </div>
                {
                    this.state.boardData.map(
                        (value, index) => (
                            <div key={index}>
                                <Cell onClick={() => this.handleCellClick(value.x, value.y)}
                                      cMenu={(e) => this._handleContextMenu(e, value.x, value.y)} value={value}/>
                                {(((index + 1) % this.props.width) === 0) ? <div className="clear"/> : ""}
                            </div>
                        ))
                }
            </div>
        );
    }
}