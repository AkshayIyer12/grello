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
            <button v-if="data.cardCheck === true" @click="deleteCard">Delete Card</button>
          </div>`,
  methods: {
    showInputOrDiv () {
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

let List = {
  props: ['listvalue', 'listindex'],
  data () {
    return {
      list: null,
      addCardCheck: false,
      group: {
        group: {
          name: 'cards'
        }
      },
      onelistinputcheck: false
    }
  },
  template: `
      <div class="insideList">
      <input type="text" placeholder="What is the list for?"
      v-if="list.listCheck === null && onelistinputcheck === true"  
      v-model="list.listTitle" 
      @keyup.enter="changeInputCheck"/>
      <p v-if="list.listCheck === true" 
      v-text="list.listTitle" 
      @click="changeInputCheck">
      </p>
      <button @click="triggerDeleteList">Delete List</button>
      <draggable v-model="list.cards" :options="group" class="listgroup">
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
      </draggable>
      <button v-if="list.listCheck === true && addCardCheck === false" 
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
      if (this.list.listCheck) {
        this.list.listCheck = null
        this.onelistinputcheck = true
        console.log('Onclick change to input emitted:::', this.onelistinputcheck)
        EventBus.$emit('one-list-input-active', !this.onelistinputcheck)
      } else {
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
          let temp = Object.assign({}, this.listvalue, this.list)
          this.$emit('updatelist', [temp, this.listindex])
          console.log('Change input check::::', temp, this.list, this.listvalue)
          console.log('Onenter change to div emitted:::')
          EventBus.$emit('one-list-input-active', !this.onelistinputcheck)
        }
      }
    },
    updateCardInList ([data, index]) {
      this.list.cards[index] = data
      this.addCardCheck = false
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
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
    },
    triggerDeleteList () {
      console.log('Trigger Delete List emitted::::::')
      this.$emit('deletelist', this.list)
    }
  },
  created () {
    this.list = JSON.parse(JSON.stringify(this.listvalue))
    if (this.list.listCheck === null) {
      this.onelistinputcheck = true
    }
    console.log(this.onelistinputcheck, this.list.listCheck)
  },
  mounted () {
    EventBus.$on('one-list-input-active', data => {
      console.log('On mount, event one-list-input-active:::::')
      this.onelistinputcheck = data
    })
  },
  watch: {
    list: {
      handler (data) {
        console.log('List component watcher triggered:::', data)
        this.$emit('updatelistcards', [data.cards, this.listindex])
      },
      deep: true
    }
  }
}

const storage = {
  fetch: () => JSON.parse(localStorage.getItem('lists') || '[]'),
  save: function (listData) {
    localStorage.setItem('lists', JSON.stringify(listData))
  }
}

const EventBus = new Vue()
new Vue({
  el: '#app',
  data () {
    return {
      listData: storage.fetch(),
      inputCheck: null,
      group: {
        group: {
          name: 'list'
        }
      }
    }
  },
  components: {
    'list': List
  },
  methods: {
    addNewList () {
      let num = uuidv4()
      let list = {
        listTitle: ``,
        cards: [],
        listCheck: null,
        listID: num
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
    },
    deleteList (list) {
      console.log('DeleteList::: ', list)
      this.listData = this.listData.filter(v => {
        if (v.listID !== list.listID) {
          return v
        }
      })
      storage.save(this.listData)
    }
  },
  watch: {
    listData: {
      handler () {
        console.log('Watcher triggered Vue instance:::')
        storage.save(this.listData)
      },
      deep: true
    }
  }
})
