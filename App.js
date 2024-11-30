import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import { Provider } from 'react-redux';
import store from './store';
import LandingPage from './screens/LandingPage';


const Stack = createStackNavigator();

export default function App() {
    return (
         <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LandingPage">
                    <Stack.Screen name="LandingPage" component={LandingPage} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Catalog" component={CatalogScreen} />
                </Stack.Navigator>
            </NavigationContainer>
         </Provider>
    );
};