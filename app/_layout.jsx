import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import React, { useEffect } from "react"

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    PoppinsBlack: require("../assets/fonts/PoppinsBlack.ttf"),
    PoppinsBold: require("../assets/fonts/PoppinsBold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/PoppinsExtraBold.ttf"),
    PoppinsLight: require("../assets/fonts/PoppinsLight.ttf"),
    PoppinsMedium: require("../assets/fonts/PoppinsMedium.ttf"),
    PoppinsRegular: require("../assets/fonts/PoppinsRegular.ttf"),
    PoppinsSemibold: require("../assets/fonts/PoppinsSemiBold.ttf"),
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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout
