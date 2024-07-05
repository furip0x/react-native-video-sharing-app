import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";
import { savePost } from "../lib/appwrite";
import tailwindConfig from "../tailwind.config";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    liked,
  },
  handleOnSave,
}) => {
  const [play, setPlay] = useState(false);

  const addPostToSaved = async (id, liked) => {
    await savePost(id, liked);
  };

  return (
    <View className="px-4 mb-14">
      <View className="flex-row items-start">
        <View className="flex-row gap-2 flex-1 items-center">
          <View className="w-[46px] h-[46px] p-0.5 border-2 border-secondary rounded-lg flex-shrink-0">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-shrink-0 pt-3"
          onPress={() => {
            addPostToSaved($id, liked);
            if (handleOnSave) {
              handleOnSave();
            }
          }}
        >
          <Image
            source={icons.bookmark}
            className="w-5 h-5"
            resizeMode="contain"
            tintColor={
              liked
                ? tailwindConfig.theme.extend.colors["secondary"]["DEFAULT"]
                : ""
            }
          />
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{
            uri: video,
          }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.STRETCH}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
          onError={(error) => console.error("Video playback error:", error)}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-4 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
