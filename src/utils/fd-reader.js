function loopFunctionsList($storage,children){
  children.forEach((item)=>{
    if (item.children && item.children.length > 0) {
      loopFunctionsList($storage,item.children)
    }else{
      // 叶子节点
      if(item.permis && item.permis.length > 0){
        $storage.set(item.uuid,item.permis)
      }
    }
  })
}

export function readAllFunction(that) {
  const fdsFiles = require.context('@/views', true, /\-fds.json$/)
  const fdFiles = require.context('@/views', true, /\-fd.json$/)
  const allFunctions = []
  const allChildFunctions = []
  // 应用定义功能
  fdsFiles.keys().reduce((modules, modulePath) => {
    fdsFiles(modulePath).forEach((fd) => {
      allFunctions.push(fd)
    })
  }, {})

  fdFiles.keys().reduce((modules, modulePath) => {
    fdFiles(modulePath).forEach((fd) => {
      allChildFunctions.push(fd)
    })
  }, {})
  // 循环找出功能点的权限配置点
  loopFunctionsList(that.$storage,allFunctions)
  // 缓存功能点
  that.$storage.set('funcList', allFunctions)
}
