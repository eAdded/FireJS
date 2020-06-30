import Link from "../../../src/components/Link.js";
import Loader from "../../../src/components/Loader.js";
import CustomLoader from "../components/CustomLoader/CustomLoader.js";
import Head from "../../../src/components/Head.js";
import "../style/main.css"

export default ({content: {emoji}}) => {
    console.log(emoji)
    const [s, setS] = React.useState(0)
    React.useEffect(() => {
        let t = 0;
        setInterval(() => setS(t++), 1000)
    }, [])
    return (
        <div>
            <Loader effect={React.useEffect} delay={400}>
                <CustomLoader/>
            </Loader>
            <Head>
                <title>Index</title>
            </Head>
            <h1>Welcome to FireJS {emoji}</h1>
            <br/>
            You have been here for {s}s
            <br/>
            <br/>
            <Link to={"/about"}>🤠 Clicked Here To Go To About Page</Link>
        </div>
    )
}