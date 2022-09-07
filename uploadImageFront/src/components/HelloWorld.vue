<template>
  <div  class="hello-container">
    <div class="drop-area" id="dropArea" :class="myData.dropAreaChange">
      <h1 class="msg">{{ msg }}</h1>
      <div v-for="item in myData.imgObj" :key="item" class="img-container">
        <img :src="item.url" alt="">
      </div>
    </div>

    <div class="deleteButton" id="deleteButton" :class="myData.deleteButtonChange" @click="deleteAllSrc">
      <h1 class="msg2">清空</h1>
    </div>

    <div class="uploadButton-container">
      <div class="upload-progress" :style="{width: `${myData.uploadProgress}%`}"></div>
      <div class="uploadButton" :class="myData.uploadButtonChange" @click="uploadImg">
        <h1 class="msg2">{{myData.uploadButtonText}}</h1>
      </div>
      <div class="view-img" @click="viewImg">查看图片</div>
    </div>

    
  </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { useStore } from 'vuex'
import { nextTick, onMounted} from 'vue'
import { useRouter } from 'vue-router';


defineProps({
  msg: String
})

const store = useStore()
const router = useRouter()

let myData = reactive({
  dropAreaChange: 'drop-area-base',
  imgObj: [],
  imgTotalSize: 0,
  comeFromDropArea: false,
  deleteButtonChange: '',
  uploadButtonChange: '',
  uploadButtonText: '上传',
  uploadProgress: 0,
})

let deleteAllSrc = () => {
  if (myData.uploadButtonText != '上传中') {
    myData.imgObj.length = 0
    myData.imgTotalSize = 0
    myData.dropAreaChange = 'drop-area-base'
  }
}

    // *************************上传按钮的方法*************************
let uploadImg = () => {
  if (myData.uploadButtonText === '上传中') return  // 上传中禁止点击
  else if (myData.uploadButtonText === '上传') {
    if (myData.imgTotalSize <= 0 || myData.imgObj.length === 0) {
      console.error('请选择图片并拖动到区域中');
      myData.uploadButtonChange = 'uploadButton-fail'
      myData.uploadButtonText = '失败'
      return
    }
    else if (myData.imgTotalSize > 50*1024*1024) {
      console.error('单次上传图片总大小不能超过50M');
      myData.uploadButtonChange = 'uploadButton-fail'
      myData.uploadButtonText = '失败'
    }

    myData.uploadButtonChange = 'uploadButton-waiting'
    myData.uploadButtonText = '上传中'


    // 处理数据
    let formdata = new FormData()
    myData.imgObj.forEach(element => {
      formdata.append('files', element.file)
    })
    axios.post('http://119.91.238.248:8056/', formdata, { // 配置项
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        myData.uploadProgress = Math.ceil( progressEvent.loaded/progressEvent.total*100 )
      }
    }).then(response => {
      if (response.data.code === 200) {
        myData.uploadButtonChange = 'uploadButton-done'
        myData.uploadButtonText = '成功'
        myData.uploadProgress = 0
        
      }
      else {
        myData.uploadButtonChange = 'uploadButton-fail'
        myData.uploadButtonText = '失败'
      }
    }).catch(error => {
      console.log(error);
      myData.uploadProgress = 0
      myData.uploadButtonChange = 'uploadButton-fail'
      myData.uploadButtonText = '失败'
    })
  }
  else { // 成功或失败时点击按钮返回
    myData.imgObj.length = 0
    myData.imgTotalSize = 0

    myData.dropAreaChange = 'drop-area-base'
    myData.uploadButtonChange = ''
    myData.uploadButtonText = '上传'
  }
}

let viewImg = () => {
  router.push('/viewimg')
}


onMounted(() => {
  const bindEvents = () => {
    const dropArea_div = document.querySelector('#dropArea')
    const deleteButton_div = document.querySelector('#deleteButton')
    
    dropArea_div.addEventListener('dragstart', e => {
      if (myData.uploadButtonText === '上传中') e.preventDefault()
      e.dataTransfer.setData("imgSrc", e.target.getAttribute('src'))
      myData.comeFromDropArea = true
      
    })

    dropArea_div.addEventListener('dragend', () => {
      myData.comeFromDropArea = false
    })


    dropArea_div.addEventListener('dragover', e => {
      e.preventDefault();
      if (myData.comeFromDropArea) {
        e.dataTransfer.dropEffect = 'none'
      }
      myData.dropAreaChange = 'drop-area-hover'
    })

    deleteButton_div.addEventListener('dragover', e => {
      e.preventDefault();
      if (!myData.comeFromDropArea) {
        e.dataTransfer.dropEffect = 'none'
      }
      else {
        myData.deleteButtonChange = 'deleteButton-drag'
      }

    })

    dropArea_div.addEventListener('dragleave', () => {
      myData.dropAreaChange = 'drop-area-base'
    })

    deleteButton_div.addEventListener('dragleave', () => {
      myData.deleteButtonChange = ''
    })

    dropArea_div.addEventListener('drop', e => {
      e.preventDefault();
      if(myData.comeFromDropArea) return
      const uploadFiles = e.dataTransfer.files;

      for (const singleFile of uploadFiles) {
        const extendName = singleFile.name.substr(singleFile.name.lastIndexOf('.'))
        if (!['.jpg','.png'].includes(extendName) || singleFile.size > 5242880) {
          console.error('文件应为JPG或PNG格式且单张大小不超过5M');
          continue;
        }

        const reader = new FileReader()
        reader.readAsDataURL(singleFile)
        reader.onload = (evt) => {
          myData.imgObj.push({
            url: evt.target.result,
            file: singleFile
          })
          myData.imgTotalSize += singleFile.size
        }
      }
      myData.dropAreaChange = 'drop-area-drop'
    })

    deleteButton_div.addEventListener('drop', e => {
      e.preventDefault();
      if(!myData.comeFromDropArea) return
      
      let src = e.dataTransfer.getData("imgSrc")
      for (let index = 0; index < myData.imgObj.length; index++) {
        const element = myData.imgObj[index]
        if (element.url === src) {
          myData.imgTotalSize -= element.file.size
          myData.imgObj.splice(index, 1)
          break
        }
      }

      myData.comeFromDropArea = false
      myData.deleteButtonChange = ''
    })
  }

  // 文档挂载完毕后绑定事件
  nextTick(() => {
    bindEvents()
  })
})
</script>


<style scoped>
  .drop-area {
    margin-top: 120px;
    width: 400px;
    height: 300px;
    border-radius: 20px;
    text-align: center;
    position: relative;
    overflow: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .drop-area::-webkit-scrollbar {
    display: none;
  }

  .drop-area-base {
    border: dashed 2px var(--myBlue);
    background-color: var(--changeBack);
  }

  .drop-area-hover {
    border: dashed 2px var(--myYellow);
    background-color: var(--changeDrag);
  }

  .drop-area-drop {
    border: solid 2px var(--myYellow);
    background-color: var(--changeBack);
  }

  .msg {
    position: absolute;
    transform: translate(0, 119px);
    z-index: 1;
    pointer-events: none;
  }

  .img-container {
    z-index: 2;
    position: relative;
    width: 100%;
    
  }
  .img-container img {
    width: 100%;
  }

  .deleteButton {
    margin-top: 30px;
    width: 200px;
    height: 50px;
    border: dashed 2px var(--myRed);
    background-color: var(--changeBack);
  }
  .deleteButton:hover {
    background-color: var(--changeDrag);
    cursor: pointer;
  }
  .deleteButton:active {
    background-color: var(--changeDrag);
    cursor: pointer;
    transform: scale(.98);
  }

  .deleteButton-drag {
    border: dashed 2px #12e2d1;
    background-color: var(--changeDrag);
  }

  .msg2 {
    pointer-events: none;
    position: relative;
    z-index: 3;
    line-height: 50px;
  }

  .uploadButton {
    margin-top: 30px;
    width: 200px;
    height: 50px;
    border: solid 2px var(--myBlue);
    background-color: var(--myBlue);
    transition-duration: .3s;
    transition-property: background-color, border;
    z-index: 1;
  }
  .uploadButton h1 {
    color: white;
  }
  .uploadButton:hover {
    opacity: .8;
    cursor: pointer;
  }
  .uploadButton:active {
    cursor: pointer;
    transform: scale(.98);
  }

  .uploadButton-done {
    border: solid 2px var(--myGreen);
    background-color: var(--myGreen);
  }

  .uploadButton-fail {
    border: solid 2px var(--myRed);
    background-color: var(--myRed);
  }

  .uploadButton-waiting {
    border: solid 2px var(--myYellow);
    background-color: var(--myYellow);
  }
  .uploadButton-waiting:hover {
    cursor: default;
    opacity: 1;
  }
  .uploadButton-waiting:active {
    cursor: default;
    transform: none;
  }

  .view-img {
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    top: 60px;
    right: -99px;
    color: #7d7d7d;
  }
  .view-img:hover {
    color: var(--myBlue);
    cursor: pointer;
    
  }
  .view-img:active {
    color: #4077bb;
    cursor: pointer;
    transform: scale(.98);
  }

  .uploadButton-container {
    position: relative;
  }
  
  .hello-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .upload-progress {
    position: absolute;
    width: 0%;
    height: 54px;
    background-color: var(--myGreen);
    top: 30px;
    left: 0px;
    z-index: 2;
    transition: .5s;
    pointer-events: none;
  }
</style>