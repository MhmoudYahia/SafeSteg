import "./Decrypt.css";
const Decrypt=()=>{
    return(
        <form>
            <div>
            <label htmlFor="source">The source file </label>
            <input type="file" id="source"></input>
            </div>
            <div>
                <input type="submit" value="Decrypt"></input>
            </div>
        </form>
    );
}

export default Decrypt;