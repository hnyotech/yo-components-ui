import Vue from 'vue';

import YoHeader from '../packages/YoHeader/src/main';
import YoContent from '../packages/YoContent/src/main';
import YoToolBar from '../packages/YoToolBar/src/main';
import MyQueryContainer from '../packages/query/src/main';
import MyGrid from '../packages/grid/src/main';
import MyEnumSelector from '../packages/picklist/src/main';
import MySection from '../packages/section/src/main';
import MyNav from '../packages/nav/src/nav';
import MyNavItem from '../packages/nav/src/nav-item';
import MyEntityLookup from '../packages/lookup/src/lookup';
import MyEntitySelectDialog from '../packages/lookup/src/lookup-dialog';
import MyMultiEntitySelectDialog from '../packages/lookup/src/lookup-multi-dialog';
import YoFile from '../packages/YoFile/src/main';
// import MyEnum from '@/components/common/MyEnum';
// import AsiasEditor from '../packages/asiaseditor/src/main';
import AsiasDetailCol from '../packages/asiasdetailcol/src/main';
import YoImg from '../packages/YoImg/src/main';
import AsiasApproveRecord from '../packages/asiasapproverecord/src/main';
import YoCity from '../packages/YoCity/src/main';
import YoButton from '../packages/YoButton/src/main';
import YoGrid from '../packages/YoGrid/src/main';
import YoGridClient from '../packages/YoGridClient/src/main'; // 客户端grid
import CheckRecord from '../packages/checkrecord/src/main';
import YoDetailCol from '../packages/YoDetailCol/src/main';
import YoEnum from '../packages/YoEnum/src/main';
import YoCheck from '../packages/YoControlsCheck/src/main';
import YoInput from '../packages/YoControlsInput/src/main';
import YoLt from '../packages/YoControlsLt/src/main';
import YoDate from '../packages/YoControlsDate/src/main';
import YoTime from '../packages/YoControlsTime/src/main';
import YoTable from '../packages/YoTable/src/main';
import YoRow from '../packages/YoRow/src/main';
import YoCol from '../packages/YoCol/src/main';
import YoDateWithBtn from '../packages/YoDateWithBtn/src/main';
import YoDialogViewer from "../packages/YoDialogViewer/src/main.vue";
import YoTableNew from '../packages/YoTableNew/src/main';
import YoTree from "../packages/YoTree/src/main.vue";
const components = [
  YoButton,
  YoHeader,
  YoContent,
  YoToolBar,
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
  YoFile,
  // AsiasEditor,
  AsiasDetailCol,
  YoImg,
  AsiasApproveRecord,
  YoCity,
  YoGrid,
  YoGridClient,
  CheckRecord,
  YoDetailCol,
  YoEnum,
  YoCheck, // 添加标的动态控件 1
  YoInput,
  YoLt,
  YoDate,
  YoTime, // 添加标的动态控件 5
  YoTable,
  YoRow,
  YoCol,
  YoDateWithBtn,
  YoDialogViewer,
  YoTableNew,
  YoTree,
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
  YoButton,
  YoHeader,
  YoContent,
  YoToolBar,
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
  YoFile,
  // AsiasEditor,
  AsiasDetailCol,
  YoImg,
  AsiasApproveRecord,
  YoCity,
  YoGrid,
  YoGridClient,
  CheckRecord,
  YoDetailCol,
  YoEnum,
  YoCheck, // 添加标的动态控件 1
  YoInput,
  YoLt,
  YoDate,
  YoTime, // 添加标的动态控件 5
  YoTable,
  YoRow,
  YoCol,
  YoDateWithBtn,
  YoDialogViewer,
  YoTableNew,
  YoTree,
}
export default yoComponents;
