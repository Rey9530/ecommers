"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishlist-store";

export function WishlistLink() {
  const items = useWishlistStore((s) => s.items);
  const hydrated = useWishlistStore((s) => s.hydrated);

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Ver favoritos"
    >
      <Link href="/cuenta/favoritos">
        <Heart className="size-5" />
        {hydrated && items.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {items.length}
          </span>
        )}
      </Link>
    </Button>
  );
}
