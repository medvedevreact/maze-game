import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "./App.scss";
import StandardGame from "./pages/StandartGame";
import EditGame from "./pages/EditGame";

const initialMaze = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

const App = () => {
  const [maze, setMaze] = useState<number[][]>(initialMaze);

  const handleSaveMaze = (newMaze: number[][]) => {
    setMaze(newMaze);
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <div className="game-selection">
              <h1>Лабиринт Минотавра</h1>
              <Link to="/standard">
                <button className="animated-button">Стандартная игра</button>
              </Link>
              <Link to="/edit">
                <button className="animated-button">Редактировать поле</button>
              </Link>
            </div>
          }
        />
        <Route path="/standard" element={<StandardGame maze={maze} />} />
        <Route
          path="/edit"
          element={<EditGame maze={maze} onSave={handleSaveMaze} />}
        />
      </Routes>
    </div>
  );
};

export default App;
