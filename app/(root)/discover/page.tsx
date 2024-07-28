"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import Searchbar from "@/components/Searchbar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Discover = ({ searchParams: { search} }: { searchParams: {search: string}}) => {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch,{search: search || ""});

  return (
    <div className="flex flex-col gap-9">
      <Searchbar/>
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Khám phá" : `Kết quả tìm kiếm cho: `}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid ">
              {podcastsData?.map(({ _id, imageUrl, description, title }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl}
                  title={title}
                  description={description}
                  podcastId={_id!}
                />
              ))}
            </div>
            ) : (
              <EmptyState title="Không tìm kiếm được kết quả nào." />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
