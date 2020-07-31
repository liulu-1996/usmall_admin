import Vue from 'vue'
var vm = new Vue();
//成功弹框
export const sAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'success'
    })
}

//警告弹框
export const wAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'warning'
    });
}