import Head from "../../../dist/Head.js";
import LazyLoad from "../../../dist/LazyLoad.js";

export default () => {
    const Markdown = LazyLoad(import("markdown-to-jsx"));
    const Markdown2 = LazyLoad(import("markdown-to-jsx"));

    return (
        <div>
            <Head>
                <title>hello</title>
            </Head>
            <Markdown>
                # hello
                `this is a pre`
                ```bash
                $ firejs
                ```
                hello
            </Markdown>
            <Markdown2>
                # hello 2
            </Markdown2>
        </div>
    )
}