import { createContext, useState, useEffect } from "react";

const WISHLIST_STORAGE_KEY = "movie-manager-wishlist";

export const WishlistContext = createContext<{
  wishlist: number[];
  addToWishlist: (movieId: number) => void;
  removeFromWishlist: (movieId: number) => void;
}>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
});

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (movieId: number) => {
    setWishlist((prev) => {
      if (prev.includes(movieId)) return prev;
      return [...prev, movieId];
    });
  };

  const removeFromWishlist = (movieId: number) => {
    setWishlist((prev) => prev.filter((id) => id !== movieId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
