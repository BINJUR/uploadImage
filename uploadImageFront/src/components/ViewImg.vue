<template>
  <div class="view-container" > 
  <!-- 返回按钮 -->
    <div class="back-to-upload-container">
      <div class="back-to-upload" @click="backToUpload">
        <h1>返回</h1>
      </div>
    </div>

    <div class="img-container">
      <div class="img-back">
        <img src="https://q1.qlogo.cn/g?b=qq&nk=1533630870&s=100" alt="" draggable="false">
        <div class="delete-mask">
          <svg t="1662103876688" @click="jumpToGithub" class="icon" id="github" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2550" width="32" height="32"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="2551" fill="white"></path></svg>
        </div>
        
      </div>
      
    </div>

    <!-- 图片列表 -->
    <div class="img-container" v-for="urlObj in store.state.imgUrls" :key="urlObj.id" >
      <div class="img-back" :class="{'img-leave': urlObj.id === store.state.currentId}">
        <img v-lazy="urlObj.url" draggable="false" class="img-lazy">
        <div class="loading-icon">
          <div class="rotate-svg">
            <svg t="1662092967119" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5163" width="32" height="32"><path d="M827.211075 221.676536m-54.351151 0a54.351151 54.351151 0 1 0 108.702302 0 54.351151 54.351151 0 1 0-108.702302 0Z" p-id="5164" fill="#5293e2"></path><path d="M940.905298 515.399947m-67.086951 0a67.086952 67.086952 0 1 0 134.173903 0 67.086952 67.086952 0 1 0-134.173903 0Z" p-id="5165" fill="#5293e2"></path><path d="M829.755035 810.595334m-78.974766 0a78.974766 78.974766 0 1 0 157.949532 0 78.974766 78.974766 0 1 0-157.949532 0Z" p-id="5166" fill="#5293e2"></path><path d="M534.831643 928.64149m-91.48657 0a91.486571 91.486571 0 1 0 182.973141 0 91.486571 91.486571 0 1 0-182.973141 0Z" p-id="5167" fill="#5293e2"></path><path d="M243.780191 805.955407m-101.902408 0a101.902408 101.902408 0 1 0 203.804816 0 101.902408 101.902408 0 1 0-203.804816 0Z" p-id="5168" fill="#5293e2"></path><path d="M536.623615 107.870315m-107.854315 0a107.854315 107.854315 0 1 0 215.70863 0 107.854315 107.854315 0 1 0-215.70863 0Z" p-id="5169" fill="#5293e2"></path><path d="M243.780191 224.220497m-107.854315 0a107.854315 107.854315 0 1 0 215.70863 0 107.854315 107.854315 0 1 0-215.70863 0Z" p-id="5170" fill="#5293e2"></path><path d="M129.429978 512.008m-102.766395 0a102.766394 102.766394 0 1 0 205.532789 0 102.766394 102.766394 0 1 0-205.532789 0Z" p-id="5171" fill="#5293e2"></path></svg>
          </div>
        </div>
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
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
import CheckPassword from './CheckPassword.vue';

const store = useStore()
const router = useRouter()

let backToUpload = () => {
  router.push('/')
}

let deleteWebImg = (urlObj) => {
  if (store.state.checkPasswordState === 'hide') {
    store.state.checkPasswordState = 'show'
  }
  else {
    store.dispatch('deleteWebImg', urlObj)
  }
}

let jumpToGithub = () => {
  window.open('https://github.com/BINJUR?tab=repositories', '_blank')
}

onBeforeMount(() => {
  store.dispatch('downloadImg')
})

</script>



<style scoped>
.view-container {
  width: 96vw;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap; 
  margin-bottom: 20px;
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

#github:hover > path {
  fill: var(--myGreen);
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

.img-lazy[lazy='loading']{
  background-color: #cccccc;
}

.img-lazy + div {
  position: absolute;
  display: none;
}

.img-lazy[lazy='loading'] + .loading-icon{
  display: block;
}

.rotate-svg {
  transform-origin: 17px 17px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate{
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>