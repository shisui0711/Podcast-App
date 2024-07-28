import { v4 } from "uuid";

export const getPodCastAudio = async ({ text, language, speed }: { text: string; language: string; speed: number
  
}) => {
  const apiKey = process.env.VOICERSS_API_KEY;

  const apiUrl = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&src=${encodeURIComponent(text)}&r=${speed}`;
  console.log(apiUrl)
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Lỗi khi gọi API");
    }
    const blob = await response.blob();
    const fileName = `podcast-${v4()}.mp3`
    const file = new File([blob!], fileName, { type: 'audio/mpeg' });
    console.log(file)
    return file
  } catch (error) {
    console.log("Error when call API: ", error);
  }
};
