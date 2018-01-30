let Card = {
  props: ['val', 'index'],
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
            <p 
            v-if="data.cardCheck === true" 
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
          this.$emit('dataChanged', [this.data, this.index])
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
    this.$emit('hideButtonSignal', false)
  }
}

let List = {
  props: ['listvalue', 'listindex'],
  data () {
    return {
      list: null,
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
      :index="index"
      :key="val.cardID"
      v-if="val !== null" 
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
      let num = uuidv4()
      let temp = {
        cardID: num,
        cardTitle: ``,
        description: 'Empty for now',
        cardCheck: null
      }
      console.log('Card created::: ', temp)
      this.list.cards.push(temp)
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
    },
    changeInputCheck () {
      if (this.list.listCheck) this.list.listCheck = null
      else {
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
          let temp = Object.assign({}, this.listvalue, this.list)
          this.$emit('updatelist', [temp, this.listindex])
          console.log('Change input check::::', temp, this.list, this.listvalue)
        }
      }
    },
    updateCardInList ([data, index]) {
      this.list.cards[index] = data
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
      this.addCardCheck = true
    },
    deleteCardInList (card) {
      console.log('Delete card:::', card)
      this.list.cards = this.list.cards.filter(v => {
        console.log('Inside filter', v, card)
        if (v.cardID !== card.cardID) {
          return v
        }
      })
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
    },
    hideAddButton (value) {
      this.addCardCheck = value
    }
  },
  created () {
    this.list = JSON.parse(JSON.stringify(this.listvalue))
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
    updateListCards ([cards, index]) {
      console.log('UpdateListCards::: ', cards, index)
      this.listData[index].cards = cards
      storage.save(this.listData)
    },
    updateList ([list, index]) {
      console.log('UpdateList::: ', list, index)
      this.listData[index] = list
      storage.save(this.listData)
    }
  },
  watch: {
    listData: {
      handler () {
        console.log('Watcher triggered:::')
        storage.save(this.listData)
      },
      deep: true
    }
  }
})
