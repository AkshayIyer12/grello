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
       <p v-text="list.listTitle"></p>
       <card v-for="(val, index) in list.cards" :val="val" :key="index"></card>
       <button @click="addNewCard(list.cards)">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addNewCard (cards) {
      cards.push(`What's the card for?`)
    }
  }
}

new Vue({
  el: '#app',
  data () {
    return {
      listData: []
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
        localStorage.setItem('lists', JSON.stringify(this.listData))
      },
      deep: true
    }
  }
})
