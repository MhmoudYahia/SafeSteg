import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";
function Home(){
    return(
        <>
        <div className="encryptDecryptBox">
            <div><a href="/Encrypt">Encrypt a message</a></div>
            <div><a href="/Decrypt">Decrypt a message</a></div>
            </div>
            
            </>
    );
}

export default Home;