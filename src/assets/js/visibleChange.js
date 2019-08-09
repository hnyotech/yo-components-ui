const visibleChange = (isVisible) => {
  const isEdge = window.navigator.userAgent.includes('Edge')
  if (isEdge && !isVisible) {
    document
      .querySelectorAll('body > .el-select-dropdown.el-popper')
      .forEach((it) => it.remove())
  }
}
export default visibleChange
