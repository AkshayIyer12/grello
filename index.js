let Card = {
  props: ['val'],
  template: `
          <div class="card">
            <p v-text="val"></p>
          </div>
          `
}
let List = {
  props: ['list'],
  template: `
      <div class="insideList">
       <input type="text" placeholder="What is the list for?"/>
       <card v-for="(val, index) in list.cards" :val="val.cardTitle" :key="index"></card>
       <button @click="addNewCard(list.cards)">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addNewCard (cards) {
      cards.push({
        cardTitle: `What is the card for?`,
        description: 'Empty for now'
      })
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
      listData: storage.fetch()
    }
  },
  components: {
    'list': List
  },
  methods: {
    addNewList () {
      this.listData.push({
        listTitle: `What's the list for?`,
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
