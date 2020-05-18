import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";
import randomWeightedPick from "pick-random-weighted";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.3,
  };

  constructor(props) {
    super(props);
    const board = this.createBoard();
    this.state = {
      hasWon: false,
      board: board,
    };
    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  determineStartingLights() {
    const odds = [
      [true, this.props.chanceLightStartsOn * 100],
      [false, (1 - this.props.chanceLightStartsOn) * 100],
    ];
    return randomWeightedPick(odds);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  createBoard() {
    let board = Array.from({ length: this.props.nrows }, () =>
      Array.from({ length: this.props.ncols }, (x) =>
        this.determineStartingLights()
      )
    );
    return board;
  }

  /** handle changing a cell: update board & determine if winner */
  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let hasWon = this.state.hasWon;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
        //above
        if (board[y - 1][x]) board[y - 1][x] = !board[y - 1][x];
        //right
        if (board[y][x + 1]) board[y][x + 1] = !board[y][x + 1];
        //below
        if (board[y + 1][x]) board[y + 1][x] = !board[y + 1][x];
        //left
        if (board[y][x - 1]) board[y][x - 1] = !board[y][x - 1];
      }
    }

    // win when every cell is turned off
    function checkGameState() {
      hasWon = board.every(function(arr) {
        return arr.every((el) => el === false);
      });
      return hasWon;
    }

    flipCell(y,x);
    checkGameState();
    this.setState({ board: board, hasWon: hasWon });
  }

  /** Render game board or winning message. */
  render() {
    return (
      <div className="Board">
        {/* if the game is won, just show a winning msg & render nothing else */}
        <table>
          <tbody>
            {this.state.hasWon ? (
              <p>You Won!</p>
            ) : (
              <tr>
                {this.state.board.map((row, idx1) => {
                  return row.map((_, idx2) => {
                    return (
                      <Cell
                        coord={`${idx1}-${idx2}`}
                        key={`${idx1}-${idx2}`}
                        flipCellsAround={this.flipCellsAround}
                        isLit={this.state.board[idx1][idx2]}
                      />
                    );
                  });
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Board;
