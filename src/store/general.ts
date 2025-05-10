import { Store } from './index.ts'
import { omit, path } from 'ramda'
export const id = 'general'

export const initialState = {
  value: 0
}

const sleepy = async (time = 100) =>
  new Promise(resolve => setTimeout(resolve, time))


export const handlers = (store: Store) => {
  const setState = (newValues: object) => {
    const currentStore = store.getState()
    const currentState = path([id], currentStore)
    store.setState({
      ...currentStore,
      [id]: { ...currentState, ...newValues },
    })
  }
  return {
    'general.setValue': async (valueToSet) => {
      console.log('Starting set value at', new Date().toISOString(),'. Value to set', valueToSet)
      await sleepy(2500)
      console.log('Setting value', valueToSet, new Date().toISOString())
      setState({ value: valueToSet })
    },
  }
}
