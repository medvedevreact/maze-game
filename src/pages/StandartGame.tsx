/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.scss";
import { FaArrowLeft } from "react-icons/fa";

type Position = {
  y: number;
  x: number;
};

type Props = {
  maze: number[][];
};

const StandardGame = ({ maze }: Props) => {
  const [position, setPosition] = useState<Position>({ y: 0, x: 0 });
  const [currentDirection, setCurrentDirection] = useState<Position>({
    y: 0,
    x: 0,
  });
  const [minotaurPosition, setMinotaurPosition] = useState<Position>({
    y: 5,
    x: 7,
  });
  const [isLose, setIsLose] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hasPlayerMoved, setHasPlayerMoved] = useState<boolean>(false);
  const navigate = useNavigate();

  const generateMinotaurPosition = () => {
    let y: number;
    let x: number;
    let distance: number;
    do {
      y = Math.floor(Math.random() * 15);
      x = Math.floor(Math.random() * 15);
      distance = Math.sqrt(
        Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
      );
    } while (
      maze[y][x] === 1 ||
      (y === position.y && x === position.x) ||
      distance < 7
    );
    console.log(distance);
    console.log(position, x, y);
    setMinotaurPosition({ y, x });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    setHasPlayerMoved(true);
    const { key } = event;
    switch (key) {
      case "ArrowUp":
        setCurrentDirection({ y: -1, x: 0 });
        break;
      case "ArrowDown":
        setCurrentDirection({ y: 1, x: 0 });
        break;
      case "ArrowLeft":
        setCurrentDirection({ y: 0, x: -1 });
        break;
      case "ArrowRight":
        setCurrentDirection({ y: 0, x: 1 });
        break;
      default:
        break;
    }
  };

  const handleButtonPress = (direction: Position) => {
    setHasPlayerMoved(true);
    setCurrentDirection(direction);
  };

  const restartGame = () => {
    setPosition({ y: 0, x: 0 });
    setCurrentDirection({ y: 0, x: 0 });
    generateMinotaurPosition();
    setIsLose(false);
    setIsWin(false);
    setShowModal(false);
    setHasPlayerMoved(false);
  };

  const bfs = (start: Position, target: Position): Position[] | null => {
    const queue = [[start]];
    const visited = new Set<string>();
    visited.add(`${start.y},${start.x}`);

    while (queue.length > 0) {
      const path = queue.shift() as Position[];

      const { y, x } = path[path.length - 1];

      if (y === target.y && x === target.x) {
        return path;
      }

      const directions = [
        { y: -1, x: 0 },
        { y: 1, x: 0 },
        { y: 0, x: -1 },
        { y: 0, x: 1 },
      ];

      for (const dir of directions) {
        const newY = y + dir.y;
        const newX = x + dir.x;
        const newPos = `${newY},${newX}`;

        if (
          newY >= 0 &&
          newY < maze.length &&
          newX >= 0 &&
          newX < maze[0].length &&
          maze[newY][newX] === 0 &&
          !visited.has(newPos)
        ) {
          visited.add(newPos);
          queue.push([...path, { y: newY, x: newX }]);
        }
      }
    }

    return null;
  };

  const moveMinotaur = () => {
    const path = bfs(minotaurPosition, position);
    if (path && path.length > 1) {
      setMinotaurPosition(path[1]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (!isLose && !isWin) {
      const timer = setInterval(() => {
        setPosition((prev) => {
          const newY = prev.y + currentDirection.y;
          const newX = prev.x + currentDirection.x;

          if (
            newY < 0 ||
            newY >= maze.length ||
            newX < 0 ||
            newX >= maze[0].length
          ) {
            return prev;
          }

          if (maze[newY][newX] === 1) {
            return prev;
          }

          return { y: newY, x: newX };
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [currentDirection, isLose, isWin]);

  useLayoutEffect(() => {
    generateMinotaurPosition();
  }, []);

  useEffect(() => {
    if (
      position.y === minotaurPosition.y &&
      position.x === minotaurPosition.x
    ) {
      setIsLose(true);
      setShowModal(true);
    }

    if (position.y === maze.length - 1 && position.x === maze[0].length - 1) {
      setIsWin(true);
      setShowModal(true);
    }
  }, [position, minotaurPosition]);

  useEffect(() => {
    if (!isLose && !isWin && hasPlayerMoved) {
      const timer = setInterval(moveMinotaur, 175);
      return () => clearInterval(timer);
    }
  }, [isLose, isWin, hasPlayerMoved, position, minotaurPosition]);

  return (
    <div className="game">
      <button
        onClick={() => {
          navigate("/");
        }}
        className="back-button"
      >
        <FaArrowLeft />
      </button>
      <div className="game-board">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${cell === 1 ? "wall" : "path"}`}
              >
                {position.y === rowIndex &&
                position.x === colIndex &&
                !isLose &&
                !isWin ? (
                  <div className="player"></div>
                ) : null}

                {minotaurPosition.y === rowIndex &&
                minotaurPosition.x === colIndex ? (
                  <div className="minotaur"></div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <div className="controls-up">
          <div
            className="arrow-up"
            onClick={() => handleButtonPress({ y: -1, x: 0 })}
          >
            ↑
          </div>
        </div>
        <div className="controls-down">
          <div
            className="arrow-left"
            onClick={() => handleButtonPress({ y: 0, x: -1 })}
          >
            ←
          </div>
          <div
            className="arrow-down"
            onClick={() => handleButtonPress({ y: 1, x: 0 })}
          >
            ↓
          </div>
          <div
            className="arrow-right"
            onClick={() => handleButtonPress({ y: 0, x: 1 })}
          >
            →
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isLose ? "Вы проиграли!" : "Вы выиграли!"}</h2>
            <button onClick={restartGame}>Играть ещё раз</button>
            <button onClick={() => navigate("/")}>Вернуться на главную</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardGame;
