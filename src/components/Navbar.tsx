import { Link } from "react-router";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistProvider";
import { motion } from "framer-motion";
import { AnimatedText } from "./animated/AnimatedText";

function Navbar() {
  const { wishlist } = useContext(WishlistContext);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="backdrop-blur-2xl bg-slate-900/80 border-b border-white/10 sticky top-0 z-50 shadow-2xl"
    >
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <AnimatedText
          text="Movie Manager"
          className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
        />
        <ul className="flex space-x-6 items-center">
          <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="relative text-gray-100 font-semibold text-lg group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all group-hover:w-full"></span>
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/wishlist"
              className="relative text-gray-100 font-semibold text-lg flex items-center gap-2 group"
            >
              Wishlist
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all group-hover:w-full"></span>
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </Link>
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  );
}

export default Navbar;
