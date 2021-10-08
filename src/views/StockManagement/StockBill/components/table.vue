<template>
    <el-table
      :data="tableData"
      :default-expand-all="true"
      :max-height="maxHeight"
      :indent="0"
      style="width: 100%">
      <!-- <el-table-column type="expand">
        <template slot-scope="{row}" class="table_expand">
          <el-form  inline class="demo-table-expand">
            <el-form-item>
              <span>{{ row.ticketCode }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ row.ticketDate }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ row.sku }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ row. }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 22 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222}}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 222 }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ 2222 }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column
        label="单据号"
        align="center"
        prop="ticketCode">
      </el-table-column>
      <el-table-column
        label="单据类型"
        align="center"
        prop="ticketType">
      </el-table-column>
      <el-table-column
        label="日期"
        align="center"
        prop="ticketDate">
      </el-table-column>
      <el-table-column
        label="店铺"
        align="center"
        prop="shopName">
      </el-table-column>
      <el-table-column
        label="SKU"
        align="center"
        prop="sku">
      </el-table-column>
      <el-table-column
        label="出库数量"
        align="center"
        prop="outCount">
        <template slot-scope="{row}">
          {{ row.type === 0 ? row.ticketCount : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="出库单价"
        align="center"
        prop="outPrice">
        <template slot-scope="{row}">
          {{ row.type === 0 ? row.ticketPrice : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="出库头程"
        align="center"
        prop="ticketHeadAmount">
          <template slot-scope="{row}">
            {{  row.type === 0 ? row.ticketHeadAmount : ''}}
          </template>
      </el-table-column>
      <el-table-column
        label="出库金额"
        align="center"
        prop="outAmount">
        <template slot-scope="{row}">
          {{ row.type === 0 ? row.ticketAmount : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="入库数量"
        align="center"
        prop="inCount">
        <template slot-scope="{row}">
          {{ row.type === 1 ? row.ticketCount : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="入库单价"
        align="center"
        prop="inPrice">
        <template slot-scope="{row}">
          {{ row.type === 1 ? row.ticketPrice : '' }}
        </template>
      </el-table-column>
      
      <el-table-column
        label="入库头程"
        align="center"
        prop="ticketHeadAmount">
          <template slot-scope="{row}">
            {{  row.type === 1 ? row.ticketHeadAmount : ''}}
          </template>
      </el-table-column>
      <el-table-column
        label="入库金额"
        align="center"
        prop="outAmount">
        <template slot-scope="{row}">
          {{ row.type === 1 ? row.ticketAmount : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="期末数量"
        align="center"
        prop="stockCount">
      </el-table-column>
      <el-table-column
        label="头程金额"
        align="center"
        prop="stockHeadAmount">
      </el-table-column>
      <el-table-column
        label="期末单价"
        align="center"
        prop="stockPrice">
      </el-table-column>
      <el-table-column
        label="期末金额"
        align="center"
        prop="stockAmount">
      </el-table-column>
    </el-table>
  </template>
  <script>
    export default {
      props: {
        tableData: {
          type: Array,
          default: () => []
        }
      },
      data() {
        return {
          maxHeight: window.innerHeight - 280
        }
      },
      mounted() {
        window.onresize = () => {
          this.maxHeight = window.innerHeight - 280
        }
      }
    }
  </script>
  <style>
    .demo-table-expand {
      font-size: 0;
      display: flex;
    }
    .demo-table-expand .el-form-item {
      flex: 1;
      text-align: center;
      margin-right: 10px;
      margin-left: 10px;
      margin-bottom: 0;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 8px 0;
      padding-left: 48px
    }
  </style>
  
