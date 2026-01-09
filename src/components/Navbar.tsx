import { Link } from "react-router";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistProvider";

function Navbar() {
  const { wishlist } = useContext(WishlistContext);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Movie Manager</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="hover:underline flex items-center gap-2">
              Wishlist
              {wishlist.length > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
