import { Link, router } from "expo-router"
import React, { useState } from "react"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CustomButton from "../../components/CustomButton"
import FormField from "../../components/FormField"
import { images } from "../../constants"
import { useGlobalContext } from "../../context/GlobalProvider"
import { getUser, signIn } from "../../lib/appwrite"

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields")
    }

    setIsSubmitting(true)

    try {
      await signIn(form.email, form.password, form.username)

      const result = await getUser()
      setUser(result)
      setIsLoggedIn(true)

      router.replace("/home")
    } catch (error) {
      console.log(error)
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="w-full h-full bg-primary">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex-1 justify-center px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />

          <Text className="text-2xl text-white font-pmedium mt-10">
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder=""
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={onSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg text-secondary-100 font-pmedium"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
