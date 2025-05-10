import { path } from 'ramda'

export const testThunk = () => async (getState, dispatch) => {
  console.info('Test thunk start', new Date().toISOString())
  console.log('General value', path(['general', 'value'], await getState()))
  await dispatch('general.setValue', 2)
  console.info('First value should be set to 2', new Date().toISOString(), '. Current general value', path(['general', 'value'], await getState()))
  await dispatch('general.setValue', 10)
  console.info('Second value should be set to 10', new Date().toISOString(), '. Current general value', path(['general', 'value'], await getState()))
}
