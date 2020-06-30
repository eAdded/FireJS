FireJS.app = FireJS.isSSR ? __FIREJS_APP__.default :
    require('react-hot-loader/root').hot(
        (props) => React.createElement(__FIREJS_APP__.default, props))