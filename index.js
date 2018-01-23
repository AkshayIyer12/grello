let Card = {
  props: ['val'],
  template: `
          <div class="card">
            <p v-text="val"></p>
          </div>
          `
}
let List = {
  props: ['text', 'ind'],
  template: `
      <div class="insideList">
       <p v-text="text.listTitle"></p>
       <card v-for="(val, index) in text.cards" :val="val" :key="index"></card>
       <button @click="addNewCard(ind, text)">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addNewCard (index, listData) {
      listData.cards.push(`What's the card for?`)
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
    addNewBoard () {
      this.listData.push({
        listTitle: `What's the list for?`,
        cards: []
      })
    }
  }
})
