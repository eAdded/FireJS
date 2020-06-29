if (module.hot)
    console.log(module.hot.check())
import Link from "../../src/components/Link.js";
import Loader from "../../src/components/Loader.js";
import CustomLoader from "./components/CustomLoader/CustomLoader.js";
import Head from "../../src/components/Head.js";
import "./style/main.css"
import {hot} from 'react-hot-loader/root';

export default hot(() => {
    const [s, setS] = React.useState(0)
    React.useEffect(() => {
        let t = 0;
        setInterval(() => setS(t++), 1000)
    }, [])
    return (
        <div>
            <Head>
                <title>Index</title>
            </Head>
            <Loader effect={React.useEffect} delay={400}>
                <CustomLoader/>
            </Loader>
            <h1>Welcome to FireJS 👋</h1>
            <br/>
            You have been asdadsadsasdpage for {s}s
            <br/>
            <br/>
            <Link to={"/about"}>🤠 Clickasd Here To Go To About Page</Link>
        </div>
    )
})