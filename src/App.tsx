import React from 'react';
import styles from './App.module.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";

function App() {
  return <div className="App"></div>;
}

export default App;
