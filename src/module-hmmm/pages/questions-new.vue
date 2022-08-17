<template>
  <div class="container">试题录入</div>
</template>

<script>
export default {
  created() {
    console.log(this.$route.query.id);
  },
};
</script>

<style scoped lang="less"></style>
