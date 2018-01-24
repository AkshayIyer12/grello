let Card = {
  props: ['val'],
  data () {
    return {
      data: {
        cardCheck: null
      }
    }
  },
  template: `
          <div class="card">
            <input type="text" v-if="data.cardCheck === null" placeholder="What is the list for?" 
             v-model="data.cardTitle" @keyup.enter="changeCardCheck"/>

            <p v-if="data.cardCheck === true" v-text="data.cardTitle" @click="changeCardCheck"></p>
          </div>`,
  methods: {
    changeCardCheck () {
      if (this.val.cardCheck) {
        this.data.cardCheck = null
      } else {
        this.data.cardCheck = true
        this.$emit('dataChanged', this.data)
      }
    }
  },
  mounted () {
    console.log('Mounted:::: ', this.val)
    this.data = JSON.parse(JSON.stringify(this.val))
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
      console.log(index)
      cards.push({
        cardId: index,
        cardTitle: ``,
        description: 'Empty for now',
        cardCheck: null
      })
    },
    changeInputCheck () {
      if (this.inputCheck) this.inputCheck = null
      else this.inputCheck = true
    },
    checkDataChanged (data) {
      console.log('Yooooo ', data, data.cardId)
      this.list.cards[data.cardId] = data
      console.log('List it is:::: ', this.list)
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
        console.log('Watcher in action:::::: ', this.listData)
        storage.save(this.listData)
      },
      deep: true
    }
  }
})
