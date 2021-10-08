<template>
    <section>
        <div>
            <el-card id="pie-one"></el-card>
        </div>
        <div>
            <el-card id="pie-two"></el-card>
        </div>
        <div>
            <el-card id="pie-three"></el-card>
        </div>
        <div>
            <el-card id="pie-four"></el-card>
        </div>
    </section>
</template>
<script>
import echarts from 'echarts'
export default {
    data() {
        return {
            onePptions: {
                title: {
                    text: '某站点用户访问来源',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: 1048, name: '搜索引擎'},
                            {value: 735, name: '直接访问'},
                            {value: 580, name: '邮件营销'},
                            {value: 484, name: '联盟广告'},
                            {value: 300, name: '视频广告'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            towPption: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 1048, name: '搜索引擎'},
                            {value: 735, name: '直接访问'},
                            {value: 580, name: '邮件营销'},
                            {value: 484, name: '联盟广告'},
                            {value: 300, name: '视频广告'}
                        ]
                    }
                ]
            },
            thressOptions: {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: [40, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: [
                            {value: 40, name: 'rose 1'},
                            {value: 38, name: 'rose 2'},
                            {value: 32, name: 'rose 3'},
                            {value: 30, name: 'rose 4'},
                            {value: 28, name: 'rose 5'},
                            {value: 26, name: 'rose 6'},
                            {value: 22, name: 'rose 7'},
                            {value: 18, name: 'rose 8'}
                        ]
                    }
                ]
            },
            fourOptions: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 1048, name: '搜索引擎'},
                            {value: 735, name: '直接访问'},
                            {value: 580, name: '邮件营销'},
                            {value: 484, name: '联盟广告'},
                            {value: 300, name: '视频广告'}
                        ]
                    }
                ]
            }
        }
    },
    mounted() {
        let one = echarts.init(document.getElementById('pie-one'))
        let two = echarts.init(document.getElementById('pie-two'))
        let three = echarts.init(document.getElementById('pie-three'))
        let four = echarts.init(document.getElementById('pie-four'))
        one.setOption(this.onePptions)
        two.setOption(this.towPption)
        three.setOption(this.thressOptions)
        four.setOption(this.fourOptions)
        window.onresize = () => {
            one.resize();
            two.resize()
            three.resize()
            four.resize()
        };
    }
}
</script>
<style scoped lang="scss">
section {
    display: flex;
    flex-wrap: wrap;
    & > div {
        margin-bottom: 15px;
        padding: 10px 20px;
        & > div {
            min-height: 380px;
        }
    }
    @media screen and (min-width: 1668px) and (max-width:1980px) {
        & > div {
            width: 25%;
            height: 100%;
        }
    }
    @media screen and (max-width:1440px) {
        & > div {
            width: 50%;
        }
    }
    @media screen and (max-width:980px) {
        & > div {
            width: 100%;
        }
    }
}
</style>
