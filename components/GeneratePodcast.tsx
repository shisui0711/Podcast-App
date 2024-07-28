"use client";

import { GeneratePodcastProps } from "@/types";
import React, { use, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { useToast } from "@/components/ui/use-toast"
import { v4 } from "uuid";


const useGeneratePodcast = ({setAudio, languageType, voicePrompt, speed, setAudioStorageId}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const getPodCastAudio = useAction(api.voicerss.generateAudioAction)

  const { toast } = useToast()

  const getAudioUrl = useMutation(api.podcasts.getUrl)

  const generatePodcast = async () => {
    setIsGenerating(true)
    setAudio('')

    if(!voicePrompt){
      toast({
        title: "Hãy điền nội dung để tạo ra podcast"
      })
      return setIsGenerating(false)
    }

    try {
      const blob = await getPodCastAudio({
        speed: speed,
        text: voicePrompt,
        language: languageType,
      })
      const fileName = `podcast-${v4()}.mp3`;
      const file = new File([blob!], fileName, { type: "audio/mpeg" });
      if(!file) throw new Error('Failed to generate audio: Empty file')
      console.log(file)
      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId

      setAudioStorageId(storageId)

      const audioUrl = await getAudioUrl({ storageId})
      setAudio(audioUrl!)
      setIsGenerating(false)
      toast({
        title: "Tạo podcast thành công"
      })
    } catch (error) {
      console.log('Error generating podcast: ',error)
      toast({
        title: "Tạo podcast thất bại",
        variant: 'destructive'
      })
      setIsGenerating(false)
      throw error
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Nội dung để tạo podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Nhập nội dung để tạo audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Đang tạo
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Tạo"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
