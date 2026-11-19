const IMGBB_API_BASE_URL = "https://api.imgbb.com/1/image"
const DEFAULT_IMAGE_NAME = "equipment"

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result ?? "")
      const base64 = result.includes(",")
        ? result.split(",")[1]
        : result

      resolve(base64)
    }

    reader.onerror = () => reject(new Error("The image could not be read."))
    reader.readAsDataURL(file)
  })
}

/**
 * Uploads an equipment image to ImgBB and returns the hosted image URL that
 * can be stored on the equipment listing. The upload is server-side free and
 * keeps binary data out of the database.
 */
export async function uploadEquipmentImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? ""

  if (!apiKey) {
    throw new Error("Image uploads are not configured.")
  }

  const body = new FormData()
  body.append("image", await readFileAsBase64(file))
  body.append("key", apiKey)
  body.append("name", file.name || DEFAULT_IMAGE_NAME)

  const response = await fetch(`${IMGBB_API_BASE_URL}?key=${apiKey}`, {
    method: "POST",
    body,
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: { url?: string }
    message?: string
  } | null

  const url = payload?.data?.url ?? ""

  if (!response.ok || !url) {
    throw new Error(
      payload?.message ?? "The image could not be uploaded. Please try again."
    )
  }

  return url
}
