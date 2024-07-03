import React from "react"
import { Image, TextInput, TouchableOpacity, View } from "react-native"
import { icons } from "../constants"

const SearchInput = ({
  value,
  placeholder,
  handleChangeText,
  keyboardType,
  ...props
}) => {
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        onChangeText={handleChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        keyboardType={keyboardType}
      />
      <TouchableOpacity onPress={() => {}}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
