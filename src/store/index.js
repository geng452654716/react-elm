import { createStore } from 'redux'
import Reducers from '../reducers'


export default function configureStore(middleware) {
    const store = createStore(Reducers,middleware)
    return store
}
