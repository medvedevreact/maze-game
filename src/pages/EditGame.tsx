import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.scss";

type Props = {
  maze: number[][];
  onSave: (newMaze: number[][]) => void;
};

const EditGame = ({ maze, onSave }: Props) => {
  const [editedMaze, setEditedMaze] = useState<number[][]>(maze);
  const navigate = useNavigate();

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Проверка на верхний левый и нижний правый углы
    if (
      (rowIndex === 0 && colIndex === 0) ||
      (rowIndex === editedMaze.length - 1 &&
        colIndex === editedMaze[0].length - 1)
    ) {
      return;
    }

    const newMaze = editedMaze.map((row, y) =>
      row.map((cell, x) => (y === rowIndex && x === colIndex ? 1 - cell : cell))
    );
    setEditedMaze(newMaze);
  };

  const handleSave = () => {
    onSave(editedMaze);
    navigate("/");
  };

  return (
    <div className="edit">
      <div className="game-board">
        {editedMaze.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${cell === 1 ? "wall" : "path"} ${
                  (rowIndex === 0 && colIndex === 0) ||
                  (rowIndex === editedMaze.length - 1 &&
                    colIndex === editedMaze[0].length - 1)
                    ? "fixed"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button className="save-button" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
};

export default EditGame;
