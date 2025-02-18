import { defineStore } from 'pinia'
const debug = false;

export const useMessagesStore = defineStore('useMessagesStore', {
  state: () => ({
    messages: [],
  }),
  actions: {
    pushMessageAction(newValue) {
      if (debug) console.log('setMessageAction triggered with ', newValue)
      this.messages.push(newValue)
    },
    deleteMessageAction(index) {
      if (debug) console.log('deleteMessageAction triggered with ', index)
      this.messages.splice(index, 1)
    },
    clearMessageAction() {
      if (debug) console.log('clearMessageAction triggered')
      this.messages = []
    },
    

  }
})
