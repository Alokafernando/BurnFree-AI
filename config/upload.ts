import axios from "axios"

const CLOUD_NAME = "dryccae28"
const UPLOAD_PRESET = "burnfree_profile"

export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append("file", {
      uri, 
      type: "image/jpeg", 
      name: "profile.jpg", 
    } as any)
    formData.append("upload_preset", UPLOAD_PRESET)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Cloudinary error response:", data)
      throw new Error(data.error?.message || "Cloudinary upload failed")
    }

    return data.secure_url
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    throw new Error("Failed to upload image to Cloudinary")
  }
}