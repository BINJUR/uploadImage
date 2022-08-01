<template>
  <div v-show="isPC" class="app-container">
    <HelloWorld msg="拖动文件以添加" class="hello-world"></HelloWorld>
    <ViewImg></ViewImg>
  </div>

  <h1 v-show="!isPC" class="forbi-andriod">请使用PC端访问</h1>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import ViewImg from './components/ViewImg.vue'

let isPC = IsPC()

function IsPC(){  
  var userAgentInfo = navigator.userAgent
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
  var flag = true;  
  for (var v = 0; v < Agents.length; v++) {  
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }  
  }  
  return flag;  
}

</script>

<style scoped>
.hello-world {
  margin-top: 120px;
}

.forbi-andriod {
  margin-top: 250px;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
