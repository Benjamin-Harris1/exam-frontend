import { NavLink } from "react-router-dom";

export const Header = () => {

  return (
    <header className="relative text-white bg-gray-900 rounded-lg shadow-lg">
      <div className="container flex items-center justify-between px-6 py-6 mx-auto">
        <h1 className={`${"block"} md:block text-4xl`}>
          <NavLink to="/" className="hover:text-gray-300">
            ATLETIK BENJAMIN 
          </NavLink>
        </h1>

      </div>
    </header>
  );
};
