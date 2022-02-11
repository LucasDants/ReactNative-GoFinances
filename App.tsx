import 'react-native-gesture-handler'

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import React from 'react';
import { 
  useFonts, 
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components'
import theme from './src/global/styles/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const { userIsLoading } = useAuth()

  if(!fontsLoaded || userIsLoading) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <AuthProvider>
            <Routes />
          </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
    )
}
