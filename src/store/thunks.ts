
export const testThunk = () => async (getState, dispatch) => {
  console.info('Test thunk start', new Date().toISOString())
  await dispatch('general.setValue', 1500)
  console.info('First value should be set', new Date().toISOString(), '. Current general value', getState().general.value)
  await dispatch('general.setValue', 2000)
  console.info('Second value should be set', new Date().toISOString(), '. Current general value', getState().general.value)
}
