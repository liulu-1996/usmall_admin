import { requestMenuList } from '../../util/request'


const state = {
    //列表数据
    list: []
}

const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr;
    }
}

const actions = {
    requestList(concext) {
        requestMenuList({ istree: true }).then(res => {
            concext.commit('changeList', res.data.list)
        })
    }
}

const getters = {
    list(state) {
        return state.list
    }
}

export default {
    state,
    mutations,
    getters,
    actions,
    namespaced: true
}