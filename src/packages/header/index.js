import MyHeader from './src/main';

/* istanbul ignore next */
MyHeader.install = function(Vue) {
  Vue.component(MyHeader.name, MyHeader);
};

export default MyHeader;