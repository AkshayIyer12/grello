<template>
  <div class='card'>
    <div class='card-title'>
      <input type='text' placeholder='What is the list for?' v-if='data.cardCheck === null' v-model='data.cardTitle' @keyup.enter='switchBtwInputDiv'/>
      <p v-if='data.cardCheck === true' v-text='data.cardTitle' @click='switchBtwInputDiv'>
      </p>
    </div>
    <button v-if='data.cardCheck === true' @click='deleteCard'><i class="fas fa-minus" v-if='data.cardCheck === true' @click='deleteCard'></i></button>
  </div>     
</template>
<script>
export default {
  name: 'card',
  props: ['val', 'index'],
  data () {
    return {
      data: null
    }
  },
  methods: {
    switchBtwInputDiv () {
      if (this.data.cardCheck) {
        this.data.cardCheck = null
      } else {
        if (this.data.cardTitle !== '') {
          this.data.cardCheck = true
          this.$emit('dataChanged', [this.data, this.index])
          this.$emit('hideButtonSignal', false)
        }
      }
    },
    deleteCard () {
      console.log('Delete card::: ', this.data)
      this.$emit('deleteSignal', this.data)
    }
  },
  created () {
    this.data = JSON.parse(JSON.stringify(this.val))
    this.checkCard = this.check
    if (this.data.cardTitle !== '') {
      this.$emit('hideButtonSignal', false)
    } else {
      this.$emit('hideButtonSignal', true)
    }
    console.log('Card created::::::::::')
  }
}
</script>
<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  /* position: relative; */
}
.card-title {
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 6px;
  min-height: 10px;
  width: 150px;
  height: 30px;
  display: flex;
  overflow: hidden;    
}
.card-title > input {
  width: 146px;
  height: 25px;
}
.card-title > p {
  align-self: center;
  padding-left: 5px;
  font: bold;
}
.card > button {
  height: 20px;
  border-radius: 5px;
  align-self: center;
  margin-left: 10px;
}
</style>
