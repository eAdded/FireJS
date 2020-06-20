import Head from "../../../dist/Head.js";
import LazyLoad from "../../../dist/LazyLoad.js";
import CustomLoader from "../components/CustomLoader/CustomLoader.js";
import Loader from "../../../src/components/Loader.js";
import "../style/main.css"
import Link from "../../../src/components/Link.js";

export default () => {
    const Markdown = LazyLoad(import("markdown-to-jsx"));

    return (
        <div>
            <Head>
                <title>404</title>
            </Head>
            <Loader effect={React.useEffect} delay={400}>
                <CustomLoader/>
            </Loader>
            <h1>😿 OH NO 404</h1>
            <br/>
            <Markdown>
                By the way, I am a lazy loaded component 😺
            </Markdown>
            <br/>
            <br/>
            <Link to={"/"}> 👻 Click Here To Go Home</Link>
        </div>
    )
}