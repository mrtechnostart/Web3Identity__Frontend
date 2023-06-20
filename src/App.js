import FundMe from "./Components/FundMe";
import Header from "./Components/Header";
import MultiPage from "./Components/MultiPage";
import Table from "./Components/Table";
import Web3Caller from "./Components/Web3Caller";
import { Route,Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={[<Header/>,<Web3Caller/>,<Table/>]}/>
        <Route path="/contracts/:addr" element={[<Header/>,<MultiPage/>]}/>
      </Routes>
    </div>
  );
}

export default App;
