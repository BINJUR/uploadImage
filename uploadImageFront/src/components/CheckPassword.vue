<template>
  <div class="gray-back">
    <div class="input-wrap">
      <div class="input-data">
        <input title="请输入字母或数字" required type="text" v-model="myData2.password" @input="handleInput" @keyup.enter="submitPassword(myData2.password)" maxlength="6" @focus="focusLabelInfo" @blur="blurLabelInfo">
        <p class="input-label">{{store.state.labelInfo}}</p>
      </div>
      <button @click="cancelLogin" class="cancel-login-button" :style="{'background-color': store.state.extraColor}">取消</button>
    </div>

    
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

let myData2 = reactive({
  password: '',
})

let handleInput = () => {
  if (store.state.labelInfo != '管理员密钥') {
    store.state.labelInfo = '管理员密钥'
    store.state.extraColor = 'var(--myBlue)'
  }
  myData2.password = myData2.password.replace(/[^A-z0-9]/g, "");
}

const submitPassword = (password) => {
  if (password.length === 0) {
    console.error('密码不能为空')
  }
  else {
    store.dispatch('submitPassword', password)
    myData2.password = ''
  }
  
}

const focusLabelInfo = () => {
  store.state.labelInfo = '管理员密钥'
}

const blurLabelInfo = () => {
  if (myData2.password === '') {
    store.state.labelInfo = '请输入管理员密钥'
  }
}

const cancelLogin = () => {
  store.state.checkPasswordState = 'hide'
  myData2.password = ''
  store.state.extraColor = 'var(--myBlue)'
}

</script>


<style scoped>
.gray-back{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  width: 450px;
  height: 300px;
  background-color: var(--changeBack);
  box-shadow: 0px 0px 5px var(--changeBack);
  border-radius: 10px
}

.input-data {
  position: relative;

}

.input-data > input {
  padding: 5px 0px;
  font-size: 30px;
  width: 300px;
  height: 30px;
  border: none;
  outline: none;
  background-color: transparent;
  border-bottom: solid 3px #aaaaaa;
  letter-spacing: 5px;
  font-weight: 500;
  text-align: center;
  transition: all .3s ease;
}

.input-data > input:focus ~ .input-label, .input-data > input:valid ~ .input-label {
  top: -25px;
  color: var(--myBlue);
}

.input-data > input:focus, .input-data > input:valid {
  border-bottom: solid 3px var(--myBlue);
}

.input-label {
  color: #aaaaaa;
  position: absolute;
  pointer-events: none;
  top: 5px;
  font-size: 20px;
  transition: all .3s ease;
}

.cancel-login-button-success {
  background-color: #179517;
  width: 700px;
}

.cancel-login-button {
  border: none;
  font-weight: bold;
  width: 200px;
  font-size: 32px;
  line-height: 32px;
  height: 50px;
  background-color: var(--myBlue);
  color: white;
  border-radius: 5px;
  margin-top: 20px;
  transform: translateY(30px);
}

.cancel-login-button:hover {
  cursor: pointer;
  opacity: .9;
}

.cancel-login-button:active {
  transform: translateY(30px) scale(.98);
}
</style>