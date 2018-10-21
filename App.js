import {
  // createStackNavigator,
  StackNavigator
} from 'react-navigation';

import { Root } from 'native-base'

import {
  LoginScreen,
  HomeScreen,
  RoomScreen,
  BoardScreen
} from 'strategyMobile/Screens';

const App = StackNavigator({
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen },
    Room: { screen: RoomScreen },
    Board: { screen: BoardScreen },
  },
  {
    initialRouteName: 'Login', // 'Login',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });

export default App;
