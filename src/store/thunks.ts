import { State } from '.'

export const testThunk =
  () => async (getState: () => State, dispatch: (action: string, payload: number) => Promise<void>) => {
    console.info('[Lab3l] - Test thunk start', new Date().toISOString())
    console.log('[Lab3l] - General value', await getState())
    await dispatch('general.setValue', 2)
    let state = await getState()
    console.info(
      '[Lab3l] - First value should be set to 2',
      new Date().toISOString(),
      '. Current general value',
      state.general
    )
    await dispatch('general.setValue', 10)
    state = await getState()
    console.info(
      '[Lab3l] - Second value should be set to 10',
      new Date().toISOString(),
      '. Current general value',
      state.general
    )
  }
