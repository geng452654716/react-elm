import { createStore } from 'redux'
import Reducers from '../reducers'

export default function configureStore(initialState) {
    const store = createStore(Reducers, initialState)
    return store
}
