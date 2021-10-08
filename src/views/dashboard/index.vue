<template>
    <main>
        <!-- <el-cascader
        placeholder="试试搜索：指南"
        class="test-cascader"
        @change="changeCascader"
        :options="options"
        v-model="salerSel"
        @visible-change="visibleChange"
        ref="cascader"
        :props="{ multiple: true, emitPath: false }"
        filterable>
        <template slot-scope="{ node, data }">
            <el-checkbox 
            v-model="checked" 
            @change="changeCheckAll(checked)" 
            class="select-all"
            v-if="data.label === '全选'">全选</el-checkbox>
        </template>
        </el-cascader> -->
        <card-list />
        <!-- <button @click="playVoice">播放语音</button> -->
        <!-- <el-input type="textarea" v-html="html" /> -->
        <!-- <div>
            <child :p-child1="child1" :p-child2="child2"   @handleClick="handleClick" />
        </div> -->
        <!-- <h2>{{ child1 }}</h2>
        <child :child.sync="child1" />
        <button @click="changeValue">{{ child1 }}</button> -->
    </main>
</template>
<script>
import cardList from './components/cardList'
import child from './components/child'
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();
export default {
    components: {
        cardList,
        child
    },
    data() {
        return {
            child1: '我是被子组件继承的内容',
            html:'<span class="text-red">123</span>',
            child2: '我是被子组件的子组件继承的内容',
            salerSel: [],
            checked: false,
            options: [
                {
                    value: 'checkAll',
                    label: '全选'
                },
                {
                    label: '指南',
                    value: 'zhinan',
                    children: [
                        {
                            label: '一致',
                            value: 'yizhi'
                        },
                        {
                            value: 'shejiyuanze',
                            label: '设计原则',
                        }
                    ]
                }
            ]
        }
    },
    mounted() {
        console.log(this.$store.state.common.colorList)
    },
    methods: {
        handleClick(message) {
            console.log(message, 12222222)
        },
        // playVoice() {
        //     this.handleSpeak('小朋友，你是否有很多问号') // 传入需要播放的文字
        // },
        // // 语音播报的函数
        // handleSpeak(text) {
        //     msg.text = text;     // 文字内容: 小朋友，你是否有很多问号
        //     msg.lang = "zh-CN";  // 使用的语言:中文
        //     msg.volume = 1;      // 声音音量：1
        //     msg.rate = 1;        // 语速：1
        //     msg.pitch = 1;       // 音高：1
        //     synth.speak(msg);    // 播放
        // },
        // // 语音停止
        // handleStop(e) {
        //     msg.text = e;
        //     msg.lang = "zh-CN";
        //     synth.cancel(msg);
        // },
        flat(arr) {
            let list = []
            for (let item of arr) {
                item['children'] ? list = list.concat(this.flat(item.children)) : list.push(item.value)
            }
            return list
        },
        changeCheckAll(val) {
            if (val) {
                this.salerSel = this.flat(this.options).filter(item => item !== 'checkAll')
                return 
            }
            this.salerSel = []
        },
        changeCascader(value) {
            if (value.length === this.flat(this.options).filter(item => item !== 'checkAll').length) {
                this.checked = true
            } else {
                this.checked = false
            }
        },
        visibleChange(type) {
            if (type) {
                const element = document.querySelector('.el-cascader-panel')
                element.classList.add('dashboard-cascader')
            }
            // this.$nextTick(() => {
            //     console.log(document.querySelector('.el-cascader-panel'))
            // })
        },
        changeValue() {
            this.child1 = 123
        },
        handleClickChild(item) {
            console.log(item)
        }
    }
    
}
</script>
<style lang="scss" scoped>
    main {
        background: url('~@/assets/dashboard/beijing.jpg');
    }
// .dashboard-cascader {
//         & > div:first-child {
//             ul:first-child {
//                 li:first-child {
//                     & > label.el-checkbox {
//                         .el-checkbox__input {
//                             display: none;
//                         }
//                     }
//                     .el-cascader-node__label {
//                         padding: 0 10px 0 0;
//                     }
//                 }
//             }
//         }
//     }
//     .el-cascader-menu__wrap {
        
//     }
// .el-scrollbar__view {
    
// }
// .text-red {color: red;}
</style>