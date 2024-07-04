import React from "react"
import { Text, View } from "react-native"

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={`justify-center items-center ${containerStyles}`}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-gray-100 text-center text-sm font-pregular">
        {subtitle}
      </Text>
    </View>
  )
}

export default InfoBox
