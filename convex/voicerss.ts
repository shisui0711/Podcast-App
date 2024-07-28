import { v } from "convex/values";
import { action } from "./_generated/server";
import { v4 } from "uuid";

export const generateAudioAction = action({
  args: { text: v.string(), language: v.string(), speed: v.number() },
  handler: async (_, { text, language, speed }) => {
    const apiKey = process.env.VOICERSS_API_KEY;

    const apiUrl = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&src=${encodeURIComponent(text)}&r=${speed}`;
    try {
      const mp3 = await fetch(apiUrl);
      if (!mp3.ok) {
        throw new Error("Lỗi khi gọi API");
      }
      return mp3.arrayBuffer()
    } catch (error) {
      console.log("Error when call API: ", error);
    }
  },
});
