let Card = {
  props: ['val'],
  data () {
    return {
      data: null
    }
  },
  template: `
          <div class="card">
            <input type="text" placeholder="What is the list for?" 
            v-if="data.cardCheck === null"  
            v-model="data.cardTitle" 
            @keyup.enter="showInputOrDiv"/>
            <p v-if="data.cardCheck === true" 
            v-text="data.cardTitle" 
            @click="showInputOrDiv">
            </p>
            <button v-if="data.cardCheck === true" @click="deleteCard">Delete</button>
          </div>`,
  methods: {
    showInputOrDiv () {
      if (this.data.cardCheck) {
        this.data.cardCheck = null
      } else {
        if (this.data.cardTitle !== '') {
          this.data.cardCheck = true
          this.$emit('dataChanged', this.data)
        }
      }
    },
    deleteCard () {
      this.$emit('deleteSignal', this.data)
    }
  },
  created () {
    this.data = JSON.parse(JSON.stringify(this.val))
    this.checkCard = this.check
    this.$emit('hideButtonSignal', false)
  }
}

let List = {
  props: ['list'],
  data () {
    return {
      addCardCheck: true
    }
  },
  template: `
      <div class="insideList">
      <input type="text" placeholder="What is the list for?"
      v-if="list.listCheck === null"  
      v-model="list.listTitle" 
      @keyup.enter="changeInputCheck"/>
      <p v-if="list.listCheck === true" 
      v-text="list.listTitle" 
      @click="changeInputCheck">
      </p>
      <card 
      v-for="(val, index) in list.cards" 
      :val="val" 
      :key="index" 
      @dataChanged="updateCardInList"
      @deleteSignal="deleteCardInList"
      @hideButtonSignal="hideAddButton">
      </card>
      <button v-if="list.listCheck === true && addCardCheck === true" 
      @click="addCardInList">+</button>
      </div>
      `,
  components: {
    'card': Card
  },
  methods: {
    addCardInList () {
      let cards = this.list.cards
      let index = cards.length
      let temp = {
        cardId: index,
        cardTitle: ``,
        description: 'Empty for now',
        cardCheck: null
      }
      cards.push(temp)
    },
    changeInputCheck () {
      if (this.list.listCheck) this.list.listCheck = null
      else {
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
        }
      }
    },
    updateCardInList (data) {
      this.list.cards[data.cardId] = data
      this.addCardCheck = true
      this.$emit('updatelists', this.list)
    },
    deleteCardInList (card) {
      this.list.cards.splice(card.cardId, 1)
    },
    hideAddButton (value) {
      this.addCardCheck = value
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
      let index = this.listData.length
      let list = {
        listTitle: ``,
        cards: [],
        listCheck: null,
        listID: index
      }
      this.listData.push(list)
    },
    updateLists (list) {
      this.listData[list.listID] = list
      storage.save(this.listData)
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
