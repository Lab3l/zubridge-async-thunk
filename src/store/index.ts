import { handlers as generalHandlers } from './general.js'

export const actionHandlers = (store: Store) => ({
  ...generalHandlers(store),
})

export type Subscribe = (listener: (state: State, prevState: State) => void) => () => void
export type Handlers = Record<string, () => void>
export type State = { general: { value: number } }
export type Store = {
  getState: () => State
  getInitialState: () => State
  setState: (stateSetter: (state: State) => State) => void
  subscribe: Subscribe
}
