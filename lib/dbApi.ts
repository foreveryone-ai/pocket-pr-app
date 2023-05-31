import { supabase } from "./supabaseClient";
// id                  String   @id @default(cuid())
// createdAt           DateTime @default(now())
// google_id           String?  @unique
// name                String?
// email               String   @unique
// image_url           String?
// youtube_channel_id  String?
// sender              Messages[]
// videos              Videos[]
// prompts             Prompts[]

// create user on sign up or sign in
export async function createUser(
  userId: string,
  googleId: string,
  name: string,
  email: string,
  imageUrl: string,
  youtubeChannelId: string
) {
  try {
    const newUser = await supabase.from("users").insert({
      id: userId,
      google_id: googleId,
      name,
      email,
      image_url: imageUrl,
      youtube_channel_id: youtubeChannelId,
    });
    return newUser;
  } catch (error) {
    console.error(error);
  }
}
// store all videos
// store all comments
// store all replies
