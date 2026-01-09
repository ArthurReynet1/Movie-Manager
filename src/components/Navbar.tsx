import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">Movie Manager</h1>
      <ul className="flex space-x-4 mt-2">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/wishlist" className="hover:underline">
            Wishlist
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
