<template>
  <el-alert
    :title='`数据一共${totalCount}条`'
    type="info"
    show-icon
    :closable='false'>
  </el-alert>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props:{
    totalCount:{
        type:Number,
        default:0
    }
  },

  created () {

  },

  methods: {

  }
}
</script>

<style scoped>

</style>
