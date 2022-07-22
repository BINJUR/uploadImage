<template>
  <div v-show="isPC" class="app-container">
    <HelloWorld msg="拖动文件以添加" class="hello-world"></HelloWorld>
    <ViewImg></ViewImg>
  </div>

  <h1 v-show="!isPC" class="forbi-andriod">请使用PC端访问</h1>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ViewImg from './components/ViewImg.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ViewImg
  },

  setup() {
    let isPC = IsPC()

    return {
      isPC,
    }
  }
}

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

<style>
* {
  margin: 0;
  padding: 0;
  user-select: none;
}

#app {
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

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
