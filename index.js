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
          this.$emit('dataChanged', [this.data, this.index])
        }
      }
    },
    deleteCard () {
      console.log('Delete card::: ', this.data)
      this.$emit('deleteSignal')
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
      :index="index"
      :key="index"
      v-if="val !== null" 
      @dataChanged="updateCardInList"
      @deleteSignal="deleteCardInList(index)"
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
      let temp = {
        cardTitle: ``,
        description: 'Empty for now',
        cardCheck: null
      }
      this.list.cards.push(temp)
    },
    changeInputCheck () {
      if (this.list.listCheck) this.list.listCheck = null
      else {
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
        }
      }
    },
    updateCardInList ([data, index]) {
      this.list.cards[index] = data
      this.addCardCheck = true
      this.$emit('updatelists', this.list)
    },
    deleteCardInList (index) {
      this.list.cards.splice(index, 1)
      this.$emit('updatelists', this.list)
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
      console.log('Update list triggered::: ', list)
      this.listData[list.listID] = list
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
