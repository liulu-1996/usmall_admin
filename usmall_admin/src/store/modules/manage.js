import { requestManageList, reqManageTotal } from '../../util/request'

const state = {
    list: [],
    size: 2,
    total: 0,
    page: 1
}

const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr;
    },
    //修改当前页数
    changePage(state, num) {
        state.page = num;
    },
    changeTotal(state, total) {
        state.total = total;
    }
}

const actions = {
    //获取列表数据
    requestList(context) {
        const params = {
            page: context.state.page,
            size: context.state.size
        }
        requestManageList(params).then(res => {
            context.commit('changeList', res.data.list)
        })
    },
    //获取总的数量
    requestTotal(context) {
        reqManageTotal().then(res => {
            context.commit('changeTotal', res.data.list[0].total)
        })
    },
    //修改页面的页码
    changePage(context, page) {
        context.commit('changePage', page)
    }
}

const getters = {
    list(state) {
        return state.list
    },
    total(state) {
        return state.total
    },
    size(state) {
        return state.size
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}