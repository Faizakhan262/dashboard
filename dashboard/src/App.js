import logo from './logo.svg';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar.js';
import MainDash from './Components/MainDash/MainDash.js';
import UserList from  './Components/UserList/UserList.js';
import GeoCoding from  './Components/GeoCoding/geocoding.js';
import Urban from  './Components/Urban/Urban.js';
import Updates from  './Components/Updates/Updates.js';
import Category from  './Components/Category/Category.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
       <div className="App">
       <div className="AppGlass">
       <Sidebar/>   
      <Routes>
      <Route path="/dashboard" element={<><MainDash></MainDash><Updates></Updates></>} />
      <Route path="/represent" element={<GeoCoding></GeoCoding>} />
      <Route path="/migrants" element={<UserList></UserList>}/>
      <Route path="/Categories" element={<Category></Category>}/>
      <Route path="/urbanization" element={<Urban></Urban>}/>
         {/* <UserList></UserList>  */}
           {/* <Extra></Extra>  */}
           </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
