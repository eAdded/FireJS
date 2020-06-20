import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import CustomLoader from "../components/CustomLoader/CustomLoader.js";
import "../style/main.css"

export default () => {
    return (
        <div>
            <Loader effect={React.useEffect} delay={5000}>
                <CustomLoader/>
            </Loader>
            <h1>This is the about page</h1>
            <Link to={"/"}>Go Home</Link>
        </div>
    )
}