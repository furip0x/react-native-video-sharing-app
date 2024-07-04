import { ResizeMode, Video } from "expo-av"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import React, { useState } from "react"
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomButton from "../../components/CustomButton"
import FormField from "../../components/FormField"
import { icons } from "../../constants"
import { useGlobalContext } from "../../context/GlobalProvider"
import { createVideo } from "../../lib/appwrite"

const Create = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  })

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert("Error", "Please fill in all the fields")
    }

    setUploading(true)

    try {
      await createVideo({ ...form, userId: user.$id })

      Alert.alert("Success", "Post uploaded successfully")
      router.push("/home")
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      })

      setUploading(false)
    }
  }

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] })
      }

      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl font-psemibold text-white">Upload Video</Text>
        <FormField
          title="Video Title"
          placeholder="Get your video a catchy title"
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
                onError={(error) =>
                  console.error("Video playback error:", error)
                }
              />
            ) : (
              <View className="w-full h-40 px-4 border-2 border-black-200 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 bg-black-100 border-2 border-black-200 rounded-2xl justify-center items-center">
                <View className="justify-center items-center flex-row">
                  <Image
                    source={icons.upload}
                    className="w-5 h-5 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-100 text-sm font-pmedium">
                    Upload
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <FormField
            title="AI Prompt"
            placeholder="The AI prompt of your video...."
            value={form.prompt}
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles="mt-10"
          />

          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create
