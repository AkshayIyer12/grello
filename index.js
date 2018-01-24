let Card = {
  props: ['val'],
  data () {
    return {
      cardCheck: null,
      data: null
    }
  },
  template: `
          <div class="card">
            <input type="text" v-if="cardCheck === null" placeholder="What is the list for?" 
             v-model="val" @keyup.enter="changeCardCheck"/>
            <p v-if="cardCheck === true" v-text="val" @click="changeCardCheck"></p>
          </div>`,
  methods: {
    changeCardCheck () {
      console.log(this.cardCheck)
      if (this.cardCheck) this.cardCheck = null
      else {
        this.cardCheck = true
        this.$emit('dataChanged', [this.data])
      }
      console.log(this.cardCheck)
    }
  }
}

let List = {
  props: ['list'],
  data () {
    return {
      inputCheck: null
    }
  },
  template: `
      <div class="insideList">
       <input type="text" v-if="inputCheck === null" placeholder="What is the list for?" 
       v-model="list.listTitle" 
       @keyup.enter="changeInputCheck"/>
       <p v-if="inputCheck === true" v-text="list.listTitle" @click="changeInputCheck"></p>
       <card v-for="(val, index) in list.cards" :val="val.cardTitle" :key="index" 
       @dataChanged="checkDataChanged"></card>
       <button @click="addNewCard(list.cards)">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addNewCard (cards) {
      cards.push({
        cardTitle: ``,
        description: 'Empty for now'
      })
    },
    changeInputCheck () {
      if (this.inputCheck) this.inputCheck = null
      else this.inputCheck = true
    },
    checkDataChanged (dat) {
      
    }
  }
}
const storage = {
  fetch: () => JSON.parse(localStorage.getItem('lists') || '[]'),
  save: function (listData) {
    localStorage.setItem('lists', JSON.stringify(listData))
  }
}

new Vue({
  el: '#app',
  data () {
    return {
      listData: storage.fetch(),
      inputCheck: null
    }
  },
  components: {
    'list': List
  },
  methods: {
    addNewList () {
      this.listData.push({
        listTitle: ``,
        cards: []
      })
    }
  },
  watch: {
    listData: {
      handler () {
        storage.save(this.listData)
      },
      deep: true
    }
  }
})
