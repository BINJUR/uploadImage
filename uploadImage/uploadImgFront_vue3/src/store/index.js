import { createStore } from "vuex"
import axios from 'axios'

export default createStore({
    state: {
        stateFlag: true,
        imgUrls: [],
    },

    actions: {
        downloadImg(context) {
            axios.get('http://localhost:8056/').then(response => {
                context.commit('updatedImgUrl', response.data.url)
                context.commit('changeStateFlag')
            }).catch(error => {
                console.log(error);
            })
        }
    },

    mutations: {
        changeStateFlag(state) {
            state.stateFlag = !state.stateFlag
        },
        updatedImgUrl(state, urls) {
            state.imgUrls = urls
        },
    },
})