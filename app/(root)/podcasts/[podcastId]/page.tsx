'use client'

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const Podcast = ({ params: { podcastId} }: { params:{ podcastId:Id<'podcasts'>}}) => {
  const { user } = useUser()

  const podcast = useQuery(api.podcasts.getPodcastById, {podcastId})

  const similarPodcast = useQuery(api.podcasts.getPodcastByLanguageType,{
    podcastId
  })

  const isOwner = user?.id === podcast?.authorId

  if(!similarPodcast || !podcast) return <LoaderSpinner />

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>
          Đang chạy
        </h1>
        <figure className='flex gap-3'>
          <Image
            src='/icons/headphone.svg'
            alt='headphone'
            width={24}
            height={24}
          />
          <h2 className='text-16 font-bold text-white-1'>
            {podcast?.views}
          </h2>
        </figure>
      </header>
      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        podcastTitle=''
        {...podcast}
      />
      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center '>
        {podcast?.description}
      </p>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Nội dung</h1>
          <p className='text-16 font-medium text-white-2'>{podcast?.voicePrompt}</p>
        </div>
        {podcast?.imagePrompt && (
          <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Nội dung hình ảnh</h1>
          <p className='text-16 font-medium text-white-2'>{podcast?.imagePrompt}</p>
        </div>
        )}
      </div>
      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Podcast tương tụ</h1>
        {similarPodcast && similarPodcast.length > 0 ? (
          <div className="podcast_grid ">
          {similarPodcast?.map(({ _id, imageUrl, description, title }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl!}
              title={title}
              description={description}
              podcastId={_id!}
            />
          ))}
        </div>
        ):(
          <EmptyState
            title='Không tìm thấy podcast tương tự'
            buttonLink='/discover'
            buttonText='Khám phá nhiều podcast hơn'
          />
        )}
      </section>
    </section>
  )
}

export default Podcast