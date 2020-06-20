import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import CustomLoader from "../components/CustomLoader/CustomLoader.js";
import "../style/main.css"

export default () => {
    return (
        <div>
            <Loader effect={React.useEffect} delay={2000}>
                <CustomLoader/>
            </Loader>
            <h1>Hello Next.js 👋</h1>
            <Link to={"/about"}>About</Link>
        </div>
    )
}