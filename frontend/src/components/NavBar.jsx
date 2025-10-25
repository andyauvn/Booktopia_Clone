import { useState } from 'react';
import NavLink from './NavLink';
import { Link } from 'react-router-dom';
import Button from './Button';
import Login from '../pages/Login';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow-lg fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Main Nav - Icon removed */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <span className="font-bold text-xl">Booktopia</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/">
                  Books
                </NavLink>
                <NavLink to="/ebooks">
                  Ebooks
                </NavLink>
                <NavLink to="/audiobooks">
                  Audio Books
                </NavLink>
              </div>
            </div>
          </div>

          {/* Auth Button (Desktop) - Icons removed */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Button onClick={onLogout} color="red" size="sm">
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button color="blue" size="sm">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Replaced icon with text */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white px-4"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Icons removed */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/">Books</NavLink>
          <NavLink to="/ebooks">Ebooks</NavLink>
          <NavLink to="/audiobooks">Audio Books</NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700 px-2">
           {isLoggedIn ? (
              <Button onClick={() => { onLogout(); setIsOpen(false); }} color="red" size="sm" className="w-full">
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button color="blue" size="sm" className="w-full">
                  Login / Register
                </Button>
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;