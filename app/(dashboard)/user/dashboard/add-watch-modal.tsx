"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import YouTubePlayer, { getYouTubeId } from "@/lib/utils/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface Ad {
  id: string;
  url: string;
}

interface AdDialogProps {
  userId: string;
  packageId: string;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdDialog({ userId, packageId }: AdDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatching, setIsWatching] = useState(false);

  // SWR for ads
  const {
    data: adsData,
    isLoading: loadingAds,
    mutate: mutateAds,
  } = useSWR(
    userId && packageId
      ? `/api/adds/daily?userId=${userId}&packageId=${packageId}`
      : null,
    fetcher
  );

  // SWR for balance
  const {
    data: balanceData,
    isLoading: loadingBalance,
    mutate: mutateBalance,
  } = useSWR(userId ? `/api/balance?userId=${userId}` : null, fetcher);

  const ads: Ad[] = adsData?.ads || [];
  const remaining: number = adsData?.remaining || 0;
  const balance: number = balanceData?.balance || 0;
  const currentAd = ads[currentIndex];

  const watchAd = async () => {
    if (!currentAd) return;
    setIsWatching(true);

    try {
      const res = await fetch("/api/adds/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          adId: currentAd.id,
          packageId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`You earned ${data.reward} ৳`);
        // Revalidate ads and balance
        await mutateAds();
        await mutateBalance();
        nextAd();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error watching ad.");
    } finally {
      setIsWatching(false);
    }
  };

  const nextAd = () => {
    if (currentIndex + 1 < ads.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("No more ads today.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger disabled={remaining === 0}>
        <Button disabled={remaining === 0}>Show Ads {remaining}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <h2 className="text-lg font-bold">Daily Ads</h2>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <p>
            Balance:{" "}
            {loadingBalance ? (
              <span className="text-gray-500 animate-pulse">Loading...</span>
            ) : (
              `${balance} ৳`
            )}
          </p>

          {loadingAds ? (
            <p className="text-gray-500 animate-pulse">Loading ads...</p>
          ) : currentAd ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <YouTubePlayer
                key={currentAd.id}
                videoId={getYouTubeId(currentAd.url)}
                onEnd={watchAd}
              />
              <p>Watch the full ad to earn your reward.</p>
              {/* <Button disabled={isWatching || loadingBalance} onClick={watchAd}>
                {isWatching ? "Watching..." : "Mark as Watched"}
              </Button> */}
            </div>
          ) : (
            <p>No ads available today.</p>
          )}
        </div>

        {/* <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={nextAd}
            disabled={ads.length === 0 || currentIndex + 1 >= ads.length}
          >
            Next Ad
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
