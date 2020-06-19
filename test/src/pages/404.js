import LazyLoad from "firejs-dist/LazyLoad.js"

export default () => {
    const Markdown = LazyLoad(import("markdown-to-jsx"));
    const Markdown2 = LazyLoad(import("markdown-to-jsx"));

    return (
        <div>
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