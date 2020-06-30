const comp = (prop) => <__FIREJS_APP__.default {...prop} />;
FireJS.app = FireJS.isSSR ? comp : require('react-hot-loader/root').hot(comp);