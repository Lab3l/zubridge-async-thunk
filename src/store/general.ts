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
    'general.setValue': async (asyncDuration) => {
      const valueToSet = Math.random()
      console.log('Start set value', asyncDuration, 'value to set', valueToSet)
      await sleepy(asyncDuration)
      setState({ value: valueToSet })
    },
  }
}
