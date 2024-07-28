"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { LegacyRef, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { LanguageType, VoiceType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import SelectLanguage from "@/components/SelectLanguage";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Tiêu đề phải chứa ít nhất 2 ký tự",
  }),
  podcastDescription: z.string().min(2, {
    message: "Ghi chú phải chứa ít nhất 2 ký tự",
  }),
});
const CreatePodcast = () => {
  const router = useRouter()
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  
  const [audioUrl, setAudioUrl] = useState('')
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioDuration, setAudioDuration] = useState(0)
  
  const [language, setLanguage] = useState<LanguageType | null>(null)
  const [speed, setSpeed] = useState(0)
  const [voicePrompt, setVoicePrompt] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPodcast = useMutation(api.podcasts.createPodcast)

  const { toast } = useToast()
  const sliderRef = useRef<HTMLSpanElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: ""
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      if(!audioUrl || !imageUrl || !language){
        toast({
          title: 'Hãy tạo audio và thumbnail'
        })
        setIsSubmitting(false)
        return
      }

      const podcast = await createPodcast({
        title: data.podcastTitle,
        description: data.podcastDescription,
        audioUrl,
        imageUrl,
        languageType: language,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
        speed
      })
      toast({
        title: 'Tạo podcast thành công'
      })
      setIsSubmitting(false)
      router.push(`/`)
      } catch (error) {
      console.log(error)
      toast({
        title: "Đã có lỗi xảy ra",
        variant: 'destructive'
      })
      setIsSubmitting(false)
    }
  }
  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Tạo Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex flex-col w-full"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Tiêu đề Podcast
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Nhập tiêu đề cho Podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <FormField
                control={form.control}
                name="podcastDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-16 font-bold text-white-1">
                      Ghi chú
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="input-class focus-visible:ring-offset-orange-1"
                        placeholder="Viết một ghi chú ngắn cho Podcast"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Label className="text-16 font-bold text-white-1">
                Chọn ngôn ngữ
              </Label>
              <SelectLanguage
                setLanguageType={setLanguage}
              />
              <div className="inline-flex items-center">
                <Label className="text-16 font-bold text-white-1">
                  Chọn tốc độ
                </Label>
                <Input disabled className="size-12 ml-5 text-center text-16 font-bold text-white-1"
                value={speed}
                />
              </div>
              <Slider
                ref={sliderRef}
                defaultValue={[speed]}
                max={10}
                min={-10}
                step={1}
                className="mt-5 bg-black-5 rounded-full"
                onChange={()=>setSpeed(Number(sliderRef.current?.ariaValueNow) || 0)}
              />
            </div>
          </div>
          <div className="flex flex-col pt-10">
              <GeneratePodcast
                setAudioStorageId={setAudioStorageId}
                setAudio={setAudioUrl}
                languageType={language!}
                audio={audioUrl}
                voicePrompt={voicePrompt}
                setVoicePrompt={setVoicePrompt}
                setAudioDuration={setAudioDuration}
                speed={speed}
              />

              <GenerateThumbnail
                setImage={setImageUrl}
                setImageStorageId={setImageStorageId}
                image={imageUrl}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
              />
              <div className="mt-10 w-full">
                <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1
                 transition-all duration-500 hover:bg-black-1">
                  {isSubmitting ? (
                    <>
                      Đang gửi
                    <Loader size={20} className="animate-spin ml-2" />
                    </>
                  ):(
                    'Gửi và phát hành Podcast'
                  )}
                </Button>
              </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
