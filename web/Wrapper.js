import Head from "../components/Head";
import {join} from "path";
import {loadPage, preloadPage} from "../components/LinkApi";

class WrapperHeadChunks extends React.Component {
    constructor() {
        super();
        this.state = {init: window.__SSR__};
        window.updatePreChunks = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <Head>
                {

                }
            </Head>
        )
    }
}

class WrapperBodyChunks extends React.Component {
    constructor() {
        super();
        this.state = {init: window.__SSR__};
        window.updateChunks = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <>
                {

                }
            </>
        )
    }
}

class WrapperBody extends React.Component {
    constructor() {
        super();
        this.state = {init: true};
        window.updateApp = () => {
            this.setState({init: true});
        }
    }

    render() {
        return (
            <>
                {this.state.init && <window.__FIREJS_APP__.default content={window.__MAP__.content}/>}
            </>
        )
    }
}