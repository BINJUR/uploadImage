import { createStore } from "vuex"
import axios from 'axios'
import { nanoid } from "nanoid"

export default createStore({
    state: {
        imgUrls: [{}],
        currentId: '',
        checkPasswordState: 'hide',
        labelInfo: '请输入管理员密钥',
        extraColor: '',
    },

    actions: {
        downloadImg(context) {
            axios.get('http://119.91.238.248:8056/').then(response => {
                context.commit('updatedImgUrl', {urls: response.data.url, method: 'replace'})
                context.commit('changeStateFlag')
            }).catch(error => {
                console.log(error)
            })
        },

        deleteWebImg(context, urlObj) {
            axios.delete(`http://119.91.238.248:8056/?deleteUrl=${urlObj.url}`).then(response => {
                context.commit('updatedImgUrl', {urls: response.data.deleteDoneUrl, method: 'delete', id: urlObj.id})
            }).catch(error => {
                console.log(error)
            })
        },

        submitPassword(context, password) {
            axios.put(`http://119.91.238.248:8056/?password=${password}`).then(response => {
                context.commit('submitPassword', {code: response.data.code})
            }).catch(error => {
                console.log(error)
                
            })
        }
    },



    mutations: {
        changeStateFlag(state) {
            state.stateFlag = !state.stateFlag
        },

        updatedImgUrl(state, config) {
            if (config.method === 'replace') {
                state.imgUrls.length = 0
                config.urls.forEach(element => {
                    const urlObj = {
                        url: element,
                        id: nanoid(6)
                    }
                    state.imgUrls.push(urlObj)
                });
            }
            // 删除图片路径
            else if (config.method === 'delete') {
                for (let index = 0; index <  state.imgUrls.length; index++) {
                    const element =  state.imgUrls[index];
                    if (element.url === config.urls) {
                        state.currentId = config.id

                        // 清除上一次的定时器
                        clearTimeout(state.timer)
                        state.timer = setTimeout(() => {
                            state.imgUrls.splice(index, 1)
                        }, 200)
                        break
                    }
                    
                }
            }
            else {
                console.log('update image url fail');
            }
        },

        submitPassword(state, config) {
            if (config.code === 200) {
                state.labelInfo = '验证通过'
                state.extraColor = 'var(--myGreen)'
                setTimeout(() => {
                    state.checkPasswordState = 'login'
                }, 500)
            }
            else {
                state.labelInfo = '验证失败'
                state.extraColor = 'var(--myRed)'
            }
        }
    },

    
})