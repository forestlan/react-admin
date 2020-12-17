/*redux 最核心的管理对象: store */

import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'



export default createStore(reducers, applyMiddleware(thunk)) 
