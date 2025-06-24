// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar, Platform }          from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator }         from '@react-navigation/stack';
import { SafeAreaProvider }             from 'react-native-safe-area-context';

/* ── Context providers ── */
import { SavedProvider }  from './Components/SavedContext';
import { DiaryProvider }  from './Components/DiaryContext';

/* ── Screens ── */
import Loader             from './Components/Loader';
import Onboarding         from './Components/Onboarding';
import HomeScreen         from './Components/HomeScreen';
import CategoriesScreen   from './Components/CategoriesScreen';
import MapScreen          from './Components/MapScreen';
import SavedScreen        from './Components/SavedScreen';
import DiaryListScreen    from './Components/DiaryListScreen';
import DiaryFormScreen    from './Components/DiaryFormScreen';
import LocationsScreen from './Components/LocationsScreen';
import LocationDetails from './Components/LocationDetails';
import DiaryDetailScreen from './Components/DiaryDetailScreen';
const Stack = createStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Показать лоудер на 3 секунды
    const t = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return <Loader />;
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000000',
      text:       '#FFFFFF',
      card:       '#000000',
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer theme={theme}>
        <SavedProvider>
          <DiaryProvider>
            <Stack.Navigator
              initialRouteName="Onboarding"
              screenOptions={{ headerShown: false }}
            >
              {/* Intro */}
              <Stack.Screen name="Onboarding" component={Onboarding} />

              {/* Main Menu */}
              <Stack.Screen name="Home"       component={HomeScreen} />

              {/* Recommended flow */}
              <Stack.Screen name="Categories" component={CategoriesScreen} />

              {/* Map & Saved */}
              <Stack.Screen name="Map"        component={MapScreen} />
              <Stack.Screen name="Saved"      component={SavedScreen} />

              {/* Tourist’s diary */}
              <Stack.Screen name="DiaryList"  component={DiaryListScreen} />
              <Stack.Screen name="DiaryForm"  component={DiaryFormScreen} />
              <Stack.Screen name="LocationsScreen"  component={LocationsScreen} />
              <Stack.Screen name="LocationDetails"  component={LocationDetails} />
              <Stack.Screen
  name="DiaryDetail"
  component={DiaryDetailScreen}
 
/>
            </Stack.Navigator>
          </DiaryProvider>
        </SavedProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
