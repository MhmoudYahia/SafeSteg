import "./Encrypt.css";
const Encrypt=()=>{
    return(
        <form>
            <div>
            <label htmlFor="source">The source file </label>
            <input type="file" id="source"></input>
            </div>
            <div>
            <label htmlFor="source">The message </label>
            <input type="text" id="source"></input>
            </div>
            <div>
                <input type="submit" value="Encrypt"></input>
            </div>
        </form>
    );
}

export default Encrypt;