import { requestRoleList } from '../../util/request'

const state = {
    list: []
}

const mutations = {
    changeList(state, arr) {
        state.list = arr;
    }
}
const actions = {
    requestList(concext) {
        requestRoleList().then(res => {
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
    actions,
    getters,
    namespaced: true
}