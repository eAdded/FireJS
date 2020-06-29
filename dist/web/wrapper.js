const comp = () => <__FIREJS_APP__.default/>;
FireJS.app = FireJS.isSSR ? comp : require('react-hot-loader/root').hot(comp);