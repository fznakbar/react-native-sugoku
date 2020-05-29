import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'

import store from './store/'

import Board from './screens/board'
import Finish from './screens/finish'
import Home from './screens/home'

const Stack = createStackNavigator()

function App() {
  return(
    <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Board" component={Board} options={{
            headerLeft : null
            }}/>
          <Stack.Screen name="Finish" component={Finish} options={{headerLeft : null}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
};

export default App
