import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function calculateWinner(squares, currentMove) {
    return {
        winner: null,
        line: null,
    };
}

function Square(props) {
    let style = {};
    if (props.highLight) {
        style.color = 'red';
    }
    return (
        <button className="square" style={style} onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, j) {
        const index = i * this.props.col + j;
        const line = this.props.line;
        const highLight = line && line.indexOf(index) !== -1;
        return (
            <Square
                key={j}
                highLight={highLight}
                value={this.props.squares[index]}
                onClick={() => this.props.onClick(index)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.props.row; ++i) {
            let row = [];
            for (let j = 0; j < this.props.col; ++j) {
                row.push(this.renderSquare(i, j));
            }
            rows.push(
                <div className="board-row" key={i}>
                    {row}
                </div>
            );
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super(...arguments);
        const total = this.props.row * this.props.col;
        const squares = Array(total).fill(null);
        this.state = {
            history: [{
                squares,
            }],
            stepNumber: 0,
            xIsNext: true,
            desc: false,
            winner: null,
            line: null,
        };
    }

    calculateWinner(squares, currMove) {
        const currSquare = squares[currMove];
        if (!currSquare) {
            return {
                winner: null,
                line: null,
            };
        }

        const total = this.props.row * this.props.col;
        const directions = [1, this.props.col, this.props.col+1, this.props.col-1];
        for (let i = 0; i < directions.length; ++i) {
            const direction = directions[i];
            let line = [currMove];

            let move = currMove;
            do {
                move += direction;
                if (move >= 0 && move < total && squares[move] === currSquare) {
                    line.push(move);
                } else {
                    break;
                }
            } while (true);

            move = currMove;
            do {
                move -= direction;
                if (move >= 0 && move < total && squares[move] === currSquare) {
                    line.push(move);
                } else {
                    break;
                }
            } while (true);

            if (line.length >= 5) {
                return {
                    line,
                    winner: currSquare,
                };
            }
        }
        return {
            winner: null,
            line: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.state.winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const {winner, line} = this.calculateWinner(squares, i);
        this.setState({
            history: history.concat([{
                squares,
                move: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            winner,
            line,
        });
    }

    jumpTo(step) {
        const current = this.state.history[step];

        const {winner, line} = this.calculateWinner(current.squares, current.move);
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
            winner,
            line,
        });
    }
    sortMoves() {
        this.setState({
            desc: !this.state.desc,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        let moves = history.map((step, moveIndex) => {
            const row = Math.floor(step.move/this.props.col) + 1;
            const col = step.move%this.props.col + 1;
            const desc = moveIndex ?
                'Move #(' + row + ', ' + col + ')':
                'Game start';

            let style = {};
            if (moveIndex === this.state.stepNumber) {
                style.fontWeight = 'bold';
            }

            return (
                <li key={moveIndex}>
                    <a href="#" style={style} onClick={() => this.jumpTo(moveIndex)}>{desc}</a>
                </li>
            )
        });
        if (this.state.desc) {
            moves.reverse();
        }

        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        row={this.props.row}
                        col={this.props.col}
                        squares={current.squares}
                        line={this.state.line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.sortMoves()}>Sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game row={15} col={15} />,
    document.getElementById('root')
);

