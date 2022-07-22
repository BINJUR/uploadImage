<template>
  <div v-show="store.state.stateFlag" class="hello-container">
    <div class="drop-area" ref="dropArea" :class="myData.dropAreaChange">
      <h1 class="msg">{{ msg }}</h1>
      <div v-for="item in myData.imgObj" :key="item" class="img-container">
        <img :src="item.url" alt="">
      </div>
    </div>

    <div class="deleteButton" ref="deleteButton" :class="myData.deleteButtonChange" @click="deleteAllSrc">
      <h1 class="msg2">清空</h1>
    </div>

    <div class="uploadButton-container">
      <div class="upload-progress" :style="{width: `${myData.uploadProgress}%`}"></div>
      <div class="uploadButton" ref="uploadButton" :class="myData.uploadButtonChange" @click="uploadImg">
        <h1 class="msg2">{{myData.uploadButtonText}}</h1>
      </div>
      <div class="view-img" @click="viewImg">查看图片</div>
    </div>

    
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { useStore } from 'vuex'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  setup() {
    const store = useStore()

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
        axios.post('http://localhost:8056/', formdata, { // 配置项
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
      store.dispatch('downloadImg')
    }

    return {
      myData,
      deleteAllSrc,
      uploadImg,
      viewImg,
      store
    }
  },

  mounted() {
    const bindEvents = () => {
      const dropArea_div = this.$refs.dropArea
      const deleteButton_div = this.$refs.deleteButton
      
      dropArea_div.addEventListener('dragstart', e => {
        if (this.myData.uploadButtonText === '上传中') e.preventDefault()
        e.dataTransfer.setData("imgSrc", e.target.getAttribute('src'))
        this.myData.comeFromDropArea = true
      })

      dropArea_div.addEventListener('dragend', () => {
        this.myData.comeFromDropArea = false
      })


      dropArea_div.addEventListener('dragover', e => {
        e.preventDefault();
        if (this.myData.comeFromDropArea) {
          e.dataTransfer.dropEffect = 'none'
        }
        this.myData.dropAreaChange = 'drop-area-hover'
      })

      deleteButton_div.addEventListener('dragover', e => {
        e.preventDefault();
        if (!this.myData.comeFromDropArea) {
          e.dataTransfer.dropEffect = 'none'
        }
        else {
          this.myData.deleteButtonChange = 'deleteButton-drag'
        }
  
      })

      dropArea_div.addEventListener('dragleave', () => {
        this.myData.dropAreaChange = 'drop-area-base'
      })

      deleteButton_div.addEventListener('dragleave', () => {
        this.myData.deleteButtonChange = ''
      })

      dropArea_div.addEventListener('drop', e => {
        e.preventDefault();
        if(this.myData.comeFromDropArea) return
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
            this.myData.imgObj.push({
              url: evt.target.result,
              file: singleFile
            })
            this.myData.imgTotalSize += singleFile.size
          }
        }
        this.myData.dropAreaChange = 'drop-area-drop'
      })

      deleteButton_div.addEventListener('drop', e => {
        e.preventDefault();
        if(!this.myData.comeFromDropArea) return
        
        let src = e.dataTransfer.getData("imgSrc")
        for (let index = 0; index < this.myData.imgObj.length; index++) {
          const element = this.myData.imgObj[index]
          if (element.url === src) {
            this.myData.imgTotalSize -= element.file.size
            this.myData.imgObj.splice(index, 1)
            break
          }
        }

        this.myData.comeFromDropArea = false
        this.myData.deleteButtonChange = ''
      })
    }

    bindEvents()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .drop-area {
    width: 400px;
    height: 300px;
    border-radius: 20px;
    text-align: center;
    position: relative;
    overflow: auto;
  }
  .drop-area::-webkit-scrollbar {
    display: none;
  }

  .drop-area-base {
    border: dashed 4px #5293e2;
    background-color: #ffffff;
  }

  .drop-area-hover {
    border: dashed 4px #ffa600;
    background-color: #d7d7d7b9;
  }

  .drop-area-drop {
    border: solid 4px #ffa600;
    background-color: #ffffff;
  }

  .msg {
    position: absolute;
    transform: translate(91px, 119px);
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
    border: dashed 4px #e92121;
    background-color: #ffffff;
  }
  .deleteButton:hover {
    border: solid 4px #e92121;
    background-color: #d7d7d774;
    cursor: pointer;
  }
  .deleteButton:active {
    border: solid 4px #e92121;
    background-color: #d7d7d7b9;
    cursor: pointer;
    transform: scale(.98);
  }

  .deleteButton-drag {
    border: dashed 4px #12e2d1;
    background-color: #d7d7d7b9;
  }

  .msg2 {
    pointer-events: none;
    position: relative;
    z-index: 3;
  }

  .uploadButton {
    margin-top: 30px;
    width: 200px;
    height: 50px;
    border: solid 4px #5293e2;
    background-color: #5293e2;
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
    border: solid 4px #179517;
    background-color: #179517;
  }

  .uploadButton-fail {
    border: solid 4px #c31919;
    background-color: #c31919;
  }

  .uploadButton-waiting {
    border: solid 4px #ffc61a;
    background-color: #ffc61a;
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
    top: 63px;
    right: -99px;
    color: #7d7d7d;
  }
  .view-img:hover {
    color: #5293e2;
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
    height: 58px;
    background-color: #179517;
    top: 30px;
    left: 0px;
    z-index: 2;
    transition: .5s;
    pointer-events: none;
  }
</style>
