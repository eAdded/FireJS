import Head from "../components/Head";
import {join} from "path";

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            app: window.__FIREJS_APP__.default,
            pre_chunks: window.__SSR__ ? window.__MAP__.chunks : [],
            chunks: window.__SSR__ ? window.__MAP__.chunks : []
        };
        window.wrapper_context = this;
        window.updateWrapperState = this.setState;
    }

    render() {
        return (
            <div>
                <Head>
                    {
                        this.state.pre_chunks.map(chunk => {
                            const href = join(`/${window.__LIB_REL__}/${chunk}`);
                            console.log("pre_chunks", href, chunk.substring(chunk.lastIndexOf(".")));
                            switch (chunk.substring(chunk.lastIndexOf("."))) {
                                case ".js":
                                    return (
                                        <link rel="preload" as="script" href={href} crossOrigin="anonymous"/>
                                    )
                                case ".css":
                                    return (
                                        <link rel="preload" as="style" href={href} crossOrigin="anonymous"/>
                                    )
                            }
                        })
                    }
                </Head>
                <this.state.app content={window.__MAP__.content}/>
                {
                    this.state.chunks.map((chunk, index) => {
                        const href = join(`/${window.__LIB_REL__}/${chunk}`);
                        switch (chunk.substring(chunk.lastIndexOf("."))) {
                            case ".js":
                                return (
                                    <script src={href} crossOrigin="anonymous"/>
                                )
                            case ".css":
                                return (
                                    <link rel="stylesheet" href={href} crossOrigin="anonymous"/>
                                )
                            default:
                                return (
                                    <link href={href}/>
                                )
                        }
                    })
                }
            </div>
        )
    }
}