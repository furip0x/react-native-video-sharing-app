import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import React, { useEffect } from "react"
import GlobalProvider from "../context/GlobalProvider"

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    PoppinsBlack: require("../assets/fonts/PoppinsBlack.ttf"),
    PoppinsBold: require("../assets/fonts/PoppinsBold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/PoppinsExtraBold.ttf"),
    PoppinsLight: require("../assets/fonts/PoppinsLight.ttf"),
    PoppinsMedium: require("../assets/fonts/PoppinsMedium.ttf"),
    PoppinsRegular: require("../assets/fonts/PoppinsRegular.ttf"),
    PoppinsThin: require("../assets/fonts/PoppinsThin.ttf"),
  })

  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) {
    return null
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="search/[query]" options={{ headerShown: false }} /> */}
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout
