<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path d="M867.9 248.1H155.5c-19.6 0-35.6-16.1-35.6-35.6 0-19.6 16.1-35.6 35.6-35.6h712.4c19.6 0 35.6 16.1 35.6 35.6s-16 35.6-35.6 35.6z m0 199.4H406.7c-19.6 0-35.6-16.1-35.6-35.6 0-19.6 16.1-35.6 35.6-35.6h461.2c19.6 0 35.6 16.1 35.6 35.6s-16 35.6-35.6 35.6z m0 199.5H406.7c-19.6 0-35.6-16.1-35.6-35.6 0-19.6 16.1-35.6 35.6-35.6h461.2c19.6 0 35.6 16.1 35.6 35.6 0 19.6-16 35.6-35.6 35.6z m0 199.5H155.5c-19.6 0-35.6-16.1-35.6-35.6 0-19.6 16.1-35.6 35.6-35.6h712.4c19.6 0 35.6 16.1 35.6 35.6s-16 35.6-35.6 35.6zM306.9 539l-103.3 73c-23.2 16.1-57 0-57-28.5V439.3c0-28.5 32-46.3 57-28.5l103.3 73c21.3 10.6 21.3 40.9 0 55.2z" p-id="2079" fill="#000000" />
    </svg>
  </div>
</template>

<script>
export default {
    name: 'Hamburger',
    props: {
        isActive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggleClick() {
            this.$emit('toggleClick')
        }
    }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
