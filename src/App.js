import SignIn from "./pages/SignInUser";
import { BrowserRouter as Router,Route,Routes} from "react-router-dom";
import GuestMode from "./pages/GuestMode";

function App(){
  return(
    <Router>
      <Routes>
        <Route path = "/signIn" element = {<SignIn/>}></Route>
        <Route path = "/" element = {<GuestMode/>}></Route>
      </Routes>
    </Router>
  
)
}
export default App;
