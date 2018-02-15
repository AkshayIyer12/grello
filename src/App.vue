<template>
  <div id='app'>
    <div class='board'> 
    <draggable v-model='listData' class='allLists' :options='group'>
        <list class='children' v-for='(value, key) in listData'
        :listvalue='value'
        :listindex='key'
        :itemediting.sync='itemEditing'
        :group='group'
        :key='value.listID'
        @setedit='setEdit'
        @updatelistcards='updateListCards'
        @updatelist='updateList'
        @deletelist='deleteList'>
        </list>
        <a class='open-list' id='listbutton' @click='addNewList'>Add a list...</a>
    </draggable>
    </div>
  </div>
</template>

<script>
import list from './components/List'
import draggable from 'vuedraggable'
const uuidv4 = require('uuid/v4')
const storage = {
  fetch: () => JSON.parse(localStorage.getItem('lists') || '[]'),
  save: listData => localStorage.setItem('lists', JSON.stringify(listData))
}

export default {
  name: 'App',
  components: {
    list,
    draggable
  },
  data () {
    return {
      listData: storage.fetch(),
      inputCheck: null,
      group: {
        group: {
          name: 'list'
        }
      },
      itemEditing: null
    }
  },
  methods: {
    setEdit (input) {
      console.log('Set edit triggered::::', input)
      this.itemEditing = input
    },
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
      this.listData = this.listData.filter(
        v => (v.listID !== list.listID ? v : null)
      )
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
}
</script>

<style scoped>
/* .allLists {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
} */
.board {
  position: absolute;
  padding: 10px 10px 10px 1px;
  /* overflow-x: auto;
  overflow-y: hidden; */
  white-space: nowrap;
}
.open-list {
  padding: 7px;
  color: hsla(0, 0%, 100%, .7);
  border-radius: 3px;
  width: 200px;
}
.open-list:hover {
  text-decoration: underline;
}
</style>
