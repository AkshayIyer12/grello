
let Card = {
  props: ['val'],
  data () {
    return {
      data: null
    }
  },
  template: `
          <div class="card">
            <input type="text" v-if="data.cardCheck === null" placeholder="What is the list for?" 
             v-model="data.cardTitle" @keyup.enter="changeCardCheck"/>
            <p v-if="data.cardCheck === true && data.cardTitle !== ''" v-text="data.cardTitle" @click="changeCardCheck"></p>
          </div>`,
  methods: {
    changeCardCheck () {
      if (this.data.cardCheck) {
        this.data.cardCheck = null
      } else {
        if (this.data.cardTitle !== '') {
          this.data.cardCheck = true
          this.$emit('dataChanged', this.data)
        }
      }
    }
  },
  created () {
    this.data = JSON.parse(JSON.stringify(this.val))
  }
}

let List = {
  props: ['list'],
  template: `
      <div class="insideList">
       <input type="text" v-if="list.listCheck === null" placeholder="What is the list for?" 
       v-model="list.listTitle" 
       @keyup.enter="changeInputCheck"/>

       <p v-if="list.listCheck === true" v-text="list.listTitle" @click="changeInputCheck"></p>

       <card v-for="(val, index) in list.cards" :val="val" :key="index" 
       @dataChanged="checkDataChanged" ></card>

       <button @click="addNewCard(list.cards)">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addNewCard (cards) {
      let index = cards.length
      cards.push({
        cardId: index,
        cardTitle: ``,
        description: 'Empty for now',
        cardCheck: null
      })
    },
    changeInputCheck () {
      if (this.list.listCheck) this.list.listCheck = null
      else this.list.listCheck = true
    },
    checkDataChanged (data) {
      this.list.cards[data.cardId] = data
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
        cards: [],
        listCheck: null
      })
    }
  },
  watch: {
    listData: {
      handler () {
        console.log('Watcher in action:::::: ', this.listData)
        storage.save(this.listData)
      },
      deep: true
    }
  }
})
