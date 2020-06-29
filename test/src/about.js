import Link from "../../src/components/Link.js";
import Loader from "../../src/components/Loader.js";
import CustomLoader from "./components/CustomLoader/CustomLoader.js";
import "./style/main.css"
import Head from "../../../src/components/Head.js";

export default () => {
    return (
        <div>
            <Head>
                <title>About</title>
            </Head>
            <Loader effect={React.useEffect} delay={400}>
                <CustomLoader/>
            </Loader>
            <h1>This is the about page</h1>
            <br/>
            <Link to={"/"}> 👻 Click Hereaasdadssdasd To Go Home. Ha ha </Link>
        </div>
    )
}