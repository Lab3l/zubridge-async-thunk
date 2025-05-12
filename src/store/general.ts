import { Store } from './index.js'
export const id = 'general'

export const initialState = {
  value: 0,
}

const sleepy = async (time = 100) => new Promise((resolve) => setTimeout(resolve, time))

export const handlers = (store: Store) => {
  return {
    'general.setValue': async (valueToSet: number) => {
      console.log('[Lab3l] Starting set value at', new Date().toISOString(), '. Value to set', valueToSet)
      await sleepy(2500)
      console.log('[Lab3l] Setting value', valueToSet, new Date().toISOString())
      store.setState((state) => ({
        ...state,
        [id]: {
          ...state[id],
          value: valueToSet,
        },
      }))
    },
  }
}
