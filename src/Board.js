import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

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

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  createBoard() {
    let board = Array.from({ length: this.props.nrows }, () =>
      Array.from({ length: this.props.ncols }, (x) =>
        Math.random() < this.props.chanceLightStartsOn ? true : false
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
      }
    }
    //flip cells
    flipCell(y , x); //clicked cell
    flipCell(y + 1 , x); //flip above
    flipCell(y - 1 , x); //flip below
    flipCell(y , x - 1); //flip left
    flipCell(y , x + 1); //flip right
    
    //Check if game has been won
    hasWon = board.every(row => row.every(cell => !cell));

    this.setState({ board: board, hasWon: hasWon });
  }

  /** Render game board or winning message. */
  render() {
    if (this.state.hasWon){
      return <h1>You Won!</h1>
    }
    let tblBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            coord={coord}
            isLit={this.state.board[y][x]}
            flipCellsAround={this.flipCellsAround}
          />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }

    return (
      <table className="Board">
        <tbody>
          {this.state.hasWon ? (
            <td>You Won!</td>
          ) : (
            <td>
              {this.state.board.map((row, idx1) => {
                return (
                  <tr key={idx1}>
                    {row.map((_, idx2) => {
                      return (
                        <Cell
                          coord={`${idx1}-${idx2}`}
                          key={`${idx1}-${idx2}`}
                          flipCellsAround={this.flipCellsAround}
                          isLit={this.state.board[idx1][idx2]}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </td>
          )}
        </tbody>
      </table>
    );
  }
}

export default Board;
