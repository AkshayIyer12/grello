<template>
  <div class="list-wrap">
  <div class='list'>
    <div class='list-title-button'>
      <div class='list-title'>
        <p v-if='list.listID !== itemediting && list.listCheck === true' v-text='list.listTitle' @click='edit'>
        </p>
        <input type='text' placeholder='What is the list for?' v-else-if='list.listCheck === null || list.listID === itemediting' v-model='list.listTitle' @keyup.enter='cancelEdit'/>
      </div>
    <button @click='deleteList'><i class="fas fa-trash-alt"></i></button>
    </div>
    
    <draggable v-model='list.cards' :options='group' class='listgroup list-cards'>
      <!-- <div class="list-cards"> -->
        <card v-for='(val, index) in list.cards'
        :val='val' :index='index' :key='val.cardID' v-if='val !== null'
        @dataChanged='updateCardInList'
        @deleteSignal='deleteCardInList'
        @hideButtonSignal='hideAddCardButton'>
        </card>
      <!-- </div> -->
    </draggable>
    <a class='open-card' v-if='list.listCheck === true && addCardCheck === false' @click='addCardInList'>Add a card...</a>
  </div>
  </div>
</template>
<script>
import card from './Card'
import draggable from 'vuedraggable'
const uuidv4 = require('uuid/v4')
export default {
  name: 'list',
  props: ['listvalue', 'listindex', 'itemediting'],
  data () {
    return {
      list: null,
      addCardCheck: false,
      group: {
        group: {
          name: 'cards'
        }
      }
    }
  },
  components: {
    card,
    draggable
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
    switchBtwInputDiv () {
      console.log(
        'List title From switchBtwInputDiv 0th:::::',
        this.list.listTitle,
        this.list.listCheck
      )
      if (this.list.listCheck) {
        // Switching from Div to input box
        this.$emit('setedit', this.list.listID)
        this.list.listCheck = false
        console.log(
          'List title From switchBtwInputDiv Input:::::',
          this.list.listTitle,
          this.list.listCheck
        )
      } else {
        // Switching from input box to div
        console.log(
          'List title From switchBtwInputDiv Div:::::',
          this.list.listTitle,
          this.list.listCheck
        )
        if (this.list.listTitle !== '') {
          this.list.listCheck = true
          let temp = Object.assign({}, this.listvalue, this.list)
          this.$emit('updatelist', [temp, this.listindex])
          console.log(
            'Change input check::::',
            temp,
            this.list,
            this.listvalue
          )
          this.$emit('setedit', null)
          console.log(
            'List title From switchBtwInputDiv Div Non-Empty ListTitle:::::',
            this.list.listTitle,
            this.list.listCheck
          )
        }
      }
    },
    edit () {
      if (this.list.listCheck) {
        // Switching from Div to input box
        this.$emit('setedit', this.list.listID)
        this.list.listCheck = false
        console.log(
          'Edit Input:::::',
          this.list.listTitle,
          this.list.listCheck
        )
      }
    },
    cancelEdit () {
      // Switching from input box to Div
      console.log(
        'Cancel Edit entry Div:::::',
        this.list.listTitle,
        this.list.listCheck
      )
      if (this.list.listTitle !== '') {
        this.list.listCheck = true
        let temp = Object.assign({}, this.listvalue, this.list)
        this.$emit('updatelist', [temp, this.listindex])
        console.log('Change input check::::', temp, this.list, this.listvalue)
        this.$emit('setedit', null)
        console.log(
          'Cancel Edit correct exit way:::::',
          this.list.listTitle,
          this.list.listCheck
        )
      }
    },
    updateCardInList ([data, index]) {
      this.list.cards[index] = data
      this.addCardCheck = false
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
    },
    deleteCardInList (card) {
      console.log('Delete card:::', card)
      this.list.cards = this.list.cards.filter(
        v => (v.cardID !== card.cardID ? v : null)
      )
      this.$emit('updatelistcards', [this.list.cards, this.listindex])
    },
    hideAddCardButton (value) {
      this.addCardCheck = value
    },
    deleteList () {
      console.log('Trigger Delete List emitted::::::')
      this.$emit('deletelist', this.list)
    }
  },
  created () {
    this.list = JSON.parse(JSON.stringify(this.listvalue))
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
</script>
<style scoped>
  .list-wrap:first-child {
    margin-left: 10px;
  }
  .list {
    background: #e2e4e6;
    border-radius: 3px;
    display: flex;
    max-height: 100%;
    flex-direction: column;
  }
  .list-wrap {
    width: 200px;
    margin: 0 5px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
  }
  .list-title {
    padding: 0px 7px;
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;

  }
  .list-title-button > button {
    height: 30px;
    align-self: center;
    border-radius: 5px;
  }
  .list-title > input {
    margin-top: 10px;
    width: 144px;
    height: 25px;
  }
   .list-title > p {
     font-weight: 400;
   }
  .list-cards {
    flex: 1 1 auto;
    margin: 0 4px;
    /* padding: 0 4px; */
    z-index: 1;
    min-height: 1px;
  }
  .open-card:active {
    background-color: #c4c9cc;
  }
  .open-card:hover {
    color: #4d4d4d;
    text-decoration: underline;
  }
  .open-card {
    padding: 8px 10px;
    display: block;
    color: #838c91;
  }
  .list-title-button {
    display: flex;
    justify-content: space-between;
    padding-right: 6px;    
  }
</style>
