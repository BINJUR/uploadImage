<template>
  <div class="view-container" v-show="!store.state.stateFlag">
    <div class="back-to-upload-container">
      <div class="back-to-upload" @click="backToUpload">
        <h1>返回</h1>
      </div>
    </div>

    <div class="img-container" v-for="url in store.state.imgUrls" :key="url">
      <img :src="url" alt="">
    </div>
    
    
  </div>
</template>

<script>
import {useStore} from 'vuex'

export default {
  name: 'ViewImg',
  setup() {
    const store = useStore()

    let backToUpload = () => {
      store.commit('changeStateFlag')
    }
    return {
      store,
      backToUpload
    }
  }
}
</script>

<style scoped>
.view-container {
  width: 96vw;
  height: 100%;
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

.img-container > img {
  width: 90%;
  transition: 3s;
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
}

.back-to-upload {
  width: 150px;
  height: 50px;
  background-color: #5293e2;
  transition-duration: .5s;
  transition-property: background-color, border;
  color: white;
  border-radius: 25px;
}
.back-to-upload:hover {
  opacity: .8;
  cursor: pointer;
}
.back-to-upload:active {
  opacity: .9;
  transform: scale(.98);
}
</style>