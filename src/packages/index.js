import Vue from 'vue';

import MyHeader from '../packages/header/src/main';
import MyContent from '../packages/content/src/main';
import MyToolbar from '../packages/toolbar/src/main';
import MyQueryContainer from '../packages/query/src/main';
import MyGrid from '../packages/grid/src/main';
import MyEnumSelector from '../packages/picklist/src/main';
import MySection from '../packages/section/src/main';
import MyNav from '../packages/nav/src/nav';
import MyNavItem from '../packages/nav/src/nav-item';
import MyEntityLookup from '../packages/lookup/src/lookup';
import MyEntitySelectDialog from '../packages/lookup/src/lookup-dialog';
import MyMultiEntitySelectDialog from '../packages/lookup/src/lookup-multi-dialog';
import AsiasFile from '../packages/asiasfile/src/main';
// import MyEnum from '@/components/common/MyEnum';
// import AsiasEditor from '../packages/asiaseditor/src/main';
import AsiasDetailCol from '../packages/asiasdetailcol/src/main';
import AsiasImg from '../packages/asiasimg/src/main';
import AsiasApproveRecord from '../packages/asiasapproverecord/src/main';
import MyCity from '../packages/city/src/main';
import AsButton from '../packages/asiasbutton/src/main';
import NewGrid from '../packages/newgrid/src/main';
import CheckRecord from '../packages/checkrecord/src/main';
import DetailCol from '../packages/detailcol/src/main';
import ComplateGrid from '../packages/complategrid/src/main';
const components = [
  AsButton,
  MyHeader,
  MyContent,
  MyToolbar,
  MyQueryContainer,
  MyGrid,
  MyEnumSelector,
  MySection,
  MyNav,
  MyNavItem,
  MyEntityLookup,
  MyEntitySelectDialog,
  MyMultiEntitySelectDialog,
  // MyEnum,np
  AsiasFile,
  // AsiasEditor,
  AsiasDetailCol,
  AsiasImg,
  AsiasApproveRecord,
  MyCity,
  NewGrid,
  CheckRecord,
  DetailCol,
  ComplateGrid
];
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
const yoComponents ={
  install,
  AsButton,
  MyHeader,
  MyContent,
  MyToolbar,
  MyQueryContainer,
  MyGrid,
  MyEnumSelector,
  MySection,
  MyNav,
  MyNavItem,
  MyEntityLookup,
  MyEntitySelectDialog,
  MyMultiEntitySelectDialog,
  // MyEnum,np
  AsiasFile,
  // AsiasEditor,
  AsiasDetailCol,
  AsiasImg,
  AsiasApproveRecord,
  MyCity,
  NewGrid,
  CheckRecord,
  DetailCol,
  ComplateGrid
}
export default yoComponents;