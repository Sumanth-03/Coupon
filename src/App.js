import logo from './logo.svg';
import './App.css';
import Home from './Components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<Home/>}/>
     {/* <Route path="/redeem" element={<Redeem />}/> */}
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
