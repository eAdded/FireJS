import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import CustomLoader from "../components/CustomLoader/CustomLoader.js";
import "../style/main.css"

export default () => {
    const [s, setS] = React.useState(0)
    React.useEffect(() => {
        let t = 0;
        setInterval(() => setS(t++), 1000)
    }, [])
    return (
        <div>
            <Loader effect={React.useEffect} delay={500}>
                <CustomLoader/>
            </Loader>
            <h1>Welcome to FireJS 👋</h1>
            <br/>
            You have been on this page for {s}s
            <br/>
            <br/>
            <Link to={"/about"}>🤠 Click Here To Go To About Page</Link>
        </div>
    )
}