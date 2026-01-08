import { createContext, useState } from "react";

const WishlistContext = createContext<{
  wishlist: number[];
  addToWishlist: (movieId: number) => void;
  removeFromWishlist: (movieId: number) => void;
}>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
});

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const addToWishlist = (movieId: number) => {
    setWishlist((prev) => [...prev, movieId]);
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
