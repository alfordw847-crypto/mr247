"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import YouTubePlayer, { getYouTubeId } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

interface Ad {
  id: string;
  url: string;
}

interface AdDialogProps {
  userId: string;
  packageId: string;
  remaining: number;
  setRemaining: any;
}

export default function AdDialog({
  userId,
  packageId,
  remaining,
  setRemaining,
}: AdDialogProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [balance, setBalance] = useState(0);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [isWatching, setIsWatching] = useState(false);

  const currentAd = ads[currentIndex];

  // Fetch daily ads
  const fetchAds = async () => {
    try {
      setLoadingAds(true);
      const res = await fetch("/api/adds/daily", {
        headers: { "user-id": userId, "package-id": packageId },
      });
      const data = await res.json();
      setRemaining(data?.remaining);
      setAds(data.ads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAds(false);
    }
  };

  // Fetch user balance
  const fetchBalance = async () => {
    try {
      setLoadingBalance(true);
      const res = await fetch("/api/balance", {
        headers: { "user-id": userId },
      });
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  // Handle watching an ad
  const watchAd = async () => {
    if (!currentAd) return;

    setIsWatching(true);

    try {
      const res = await fetch("/api/adds/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, adId: currentAd.id, packageId }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`You earned ${data.reward} ৳`);
        await fetchBalance();
        nextAd();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error watching ad.");
    } finally {
      setIsWatching(false);
    }
  };

  const nextAd = () => {
    if (currentIndex + 1 < ads.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more ads today.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger disabled={remaining === 0}>
        <Button disabled={remaining === 0}>Show ads {remaining}</Button>
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

        <DialogFooter className="mt-4">
          {/* <Button
            variant="outline"
            onClick={nextAd}
            disabled={ads.length === 0 || currentIndex + 1 >= ads.length}
          >
            Next Ad
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
