import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite"

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECTID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASEID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERCOLLECTIONID,
  videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEOCOLLECTIONID,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGEID,
}

const client = new Client()

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    throw new Error(error)
  }
}

// Get Current User
export async function getUser() {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw new Error("Account not found")

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User not found in database")
    }

    return currentUser.documents[0]
  } catch (error) {
    console.error("Error getting user:", error.message)
    return null
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      )
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export async function uploadFile(file, type) {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    )
    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error) {
    console.error("uploadFile error")
    throw new Error(error)
  }
}

export async function createVideo(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost
  } catch (error) {
    console.error("createVideo error")
    throw new Error(error)
  }
}
