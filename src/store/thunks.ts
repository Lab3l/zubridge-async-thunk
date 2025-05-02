
export const testThunk = () => async (getState, dispatch) => {
  console.log('test thunk start')
  await dispatch('general.setValue', 1500)
  console.info('First value should be set')
  await dispatch('general.setValue', 2000)
  console.info('Second value should be set')
}
