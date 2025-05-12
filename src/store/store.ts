import { createStore } from 'zustand/vanilla'

import { State } from './index'
import { initialState as generalInitialState } from './general.js'

export const STORE_INITIAL_STATE = {
  general: generalInitialState,
}

export const store = createStore<State>()(() => {
  return {
    general: {
      ...generalInitialState,
    },
  }
})
