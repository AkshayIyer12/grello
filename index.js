
let Card = {
  props: ['val', 'check'],
  data () {
    return {
      data: null,
      checkCard: null
    }
  },
  template: `
          <div class="card">
            <input type="text" v-if="data.cardCheck === null" placeholder="What is the list for?" 
             v-model="data.cardTitle" @keyup.enter="changeCardCheck" @blur="emitLostFocus"/>
            <p v-if="data.cardCheck === true" v-text="data.cardTitle" @click="changeCardCheck"></p>
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
    },
    emitLostFocus () {
      this.checkCard = false
      this.$emit('lostFocus', [this.data, this.checkCard])
    }
  },
  created () {
    this.data = JSON.parse(JSON.stringify(this.val))
    this.checkCard = this.check
  }
}

let List = {
  props: ['list'],
  data () {
    return {
      checker: true
    }
  },
  template: `
      <div class="insideList">
       <input type="text" v-if="list.listCheck === null" placeholder="What is the list for?" 
       v-model="list.listTitle" 
       @keyup.enter="changeInputCheck"/>

       <p v-if="list.listCheck === true" v-text="list.listTitle" @click="changeInputCheck"></p>

       <card v-if="checker" v-for="(val, index) in list.cards" :val="val" :check="checker" 
       :key="index" 
       @dataChanged="checkDataChanged" @lostFocus="removeCard"></card>

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
      else {
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
        }
      }
    },
    checkDataChanged (data) {
      this.list.cards[data.cardId] = data
    },
    removeCard ([data, checkCard]) {
      this.checker = checkCard
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
