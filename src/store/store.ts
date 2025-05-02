import { createStore } from 'zustand/vanilla'
import Store from 'electron-store'
import { isEmpty } from 'ramda'

import { State } from './index'
import { initialState as generalInitialState } from './general.ts'

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
