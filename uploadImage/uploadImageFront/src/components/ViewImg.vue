<template>
  <div class="view-container" v-show="!store.state.stateFlag">
  <!-- 返回按钮 -->
    <div class="back-to-upload-container">
      <div class="back-to-upload" @click="backToUpload">
        <h1>返回</h1>
      </div>
    </div>
    
    <!-- 图片列表 -->
    <div class="img-container" v-for="urlObj in store.state.imgUrls" :key="urlObj.id" >
      <div class="img-back" :class="{'img-leave': urlObj.id === store.state.currentId}">
        <img :src="urlObj.url" alt="" draggable="false">
        <div class="delete-mask">
          <svg t="1658586563752" @click="deleteWebImg(urlObj)" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3063" width="32" height="32"><path d="M169.671331 228.433666c0-23.3805 19.069311-42.339294 42.615587-42.339294l213.026768 0 0-42.285059c0-23.381523 19.069311-42.285059 42.615587-42.285059l85.23322 0c23.546276 0 42.615587 18.959817 42.615587 42.339294l0 42.339294L808.804846 186.202842c23.491017 0 42.615587 18.959817 42.615587 42.340317l0 42.339294L169.671331 270.882454 169.671331 228.433666 169.671331 228.433666zM808.804846 355.343077l0 84.625376 0 437.216783c0 23.3805-19.125593 42.340317-42.617633 42.340317l-511.284709 0c-23.546276 0-42.615587-18.958794-42.615587-42.340317L212.286917 439.968453l0-84.625376L212.286917 313.114301 808.804846 313.114301 808.804846 355.343077 808.804846 355.343077zM382.697075 440.022689c0-23.381523-19.12457-42.339294-42.615587-42.339294-23.491017 0-42.561351 18.958794-42.561351 42.339294l0 352.648712c0 23.325241 19.069311 42.285059 42.615587 42.285059 23.546276 0 42.615587-18.959817 42.615587-42.285059L382.751311 440.022689 382.697075 440.022689 382.697075 440.022689zM553.162492 440.022689c0-23.381523-19.125593-42.339294-42.617633-42.339294-23.546276 0-42.615587 18.958794-42.615587 42.339294l0 352.648712c0 23.325241 19.12457 42.285059 42.615587 42.285059s42.617633-18.959817 42.617633-42.285059L553.162492 440.022689 553.162492 440.022689zM723.571626 440.022689c0-23.381523-19.069311-42.339294-42.615587-42.339294s-42.615587 18.958794-42.615587 42.339294l0 352.648712c0 23.325241 19.12457 42.285059 42.615587 42.285059 23.491017 0 42.615587-18.959817 42.615587-42.285059L723.571626 440.022689 723.571626 440.022689z" p-id="3064" fill="white"></path></svg>
        </div>
        
      </div>
      
    </div>

    <!-- 弹出验证框 -->
      <CheckPassword v-show="store.state.checkPasswordState === 'show'"></CheckPassword>
  
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import CheckPassword from './CheckPassword.vue';


const store = useStore()

let backToUpload = () => {
  store.commit('changeStateFlag')
}

let deleteWebImg = (urlObj) => {
  if (store.state.checkPasswordState === 'hide') {
    store.state.checkPasswordState = 'show'
  }
  else {
    store.dispatch('deleteWebImg', urlObj)
  }
}

</script>

<style scoped>
.view-container {
  width: 96vw;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}

.img-container {
  margin-top: 20px;
  width: 20%;
  height: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.img-back {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 90%;
  transition: all .4s ease;
}

.img-back:hover {
  background-color: var(--changeTank);
  cursor: pointer;
  transform: translateY(-10px);
}

.img-back:hover .delete-mask{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.img-back > .delete-mask > svg:hover > path {
  fill: var(--myRed);
}

.img-back > .delete-mask > svg:hover {
  transform: scale(1.1);
}

.img-back > .delete-mask > svg:active {
  transform: scale(1);
}

.img-back > .delete-mask > svg {
  transition: .2s;
}

.img-back > img {
  width: 100%;
}

.img-back > svg {
  position: absolute;
}

.delete-mask {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.back-to-upload-container {
  padding-bottom: 30px;
  position: fixed;
  width: 100%;
  height: 50px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 9;
  pointer-events: none;
  transform: translateX(-2%);
}

.back-to-upload {
  width: 150px;
  height: 50px;
  background-color:var(--myBlue);
  transition-duration: .3s;
  transition-property: background-color, border;
  color: white;
  border-radius: 25px;
  pointer-events: auto;
}
.back-to-upload:hover {
  background-color: #3e85dc;
  cursor: pointer;
}
.back-to-upload:active {
  background-color: #307ddd;
  transform: scale(.98);
}

.back-to-upload > h1 {
  pointer-events: none;
  line-height: 50px;
  font-size: 30px;
}

.img-leave {
  transition: .3s ease-out;
  opacity: 0;
  width: 0%;
  height: 0px;
}
</style>