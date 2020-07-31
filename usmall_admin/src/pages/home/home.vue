<template>
 <div >
     <div id="main" style="width: 1000px;height:400px;"></div>
 </div>
</template>
<script>
import echarts from 'echarts'
export default {
 components: {},
 data() {
  return {};
 },
 methods: {},
  mounted() {
     var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '服装'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
  }
};
</script>
<style scoped>
</style>