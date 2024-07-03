import { router } from "expo-router"
import React from "react"
import { Image, Text, View } from "react-native"
import { images } from "../constants"
import CustomButton from "./CustomButton"

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-pmedium text-sm text-gray-100">{title}</Text>
      <Text className="font-psemibold text-xl text-center mt-2 text-gray-100">
        {subtitle}
      </Text>

      <CustomButton
        title="Create Video"
        containerStyles="w-full my-5"
        handlePress={() => router.push("/create")}
      />
    </View>
  )
}

export default EmptyState
