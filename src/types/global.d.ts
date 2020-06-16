declare module NodeJS {
    interface Global {
        window: {
            __LIB_REL__: string,
            __MAP_REL__: string,
            __MAP__: {
                content: any,
                chunks: string[]
            },
            __SSR__: boolean,
            __FIREJS_APP__: {
                default: any
            },
            React: any,
            ReactDOMServer: any
        }
    }
}