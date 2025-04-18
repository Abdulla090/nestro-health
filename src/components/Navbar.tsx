"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { t } = useLanguage();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Remove all feature navigation items, keeping only home
  const navItems = [
    { name: t("nav.home"), path: "/" },
  ];

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  const openProfileModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileModalOpen(true);
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
            : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">N</div>
                <span className="text-2xl font-bold text-gray-800">
                  {t("common.appName")}<span className="text-blue-600">.</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex flex-grow justify-center items-center">
              <div className="flex items-center space-x-4">
                {/* Home Link */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-link font-sorani ${
                      pathname === item.path
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Auth links */}
                {!loading && (
                  <div className="flex items-center space-x-4">
                    {user || profile ? (
                      <>
                        <Link
                          href="/profile"
                          className={`nav-link font-sorani ${
                            pathname === "/profile"
                              ? "text-blue-600 font-semibold"
                              : "text-gray-700 hover:text-blue-600"
                          }`}
                        >
                          {t("nav.profile")}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="nav-link font-sorani text-gray-700 hover:text-blue-600"
                        >
                          {t("nav.signOut")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={openProfileModal}
                          className={`nav-link font-sorani text-gray-700 hover:text-blue-600`}
                        >
                          {t("nav.createProfile") || "Create Profile"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Language switcher and mobile menu button - flexed to the right */}
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/login"
                className="hidden md:flex items-center text-sm px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Admin
              </Link>
              <div className="md:block border-l border-gray-200 pl-4">
                <LanguageSwitcher />
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-md font-sorani ${
                    pathname === item.path
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin link for mobile */}
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Admin
              </Link>
              
              {/* Auth links for mobile */}
              {!loading && (
                <>
                  {user || profile ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-2 px-3 rounded-md font-sorani ${
                          pathname === "/profile"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        {t("nav.profile")}
                      </Link>
                      <button
                        onClick={(e) => {
                          handleSignOut(e);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left block py-2 px-3 rounded-md font-sorani text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      >
                        {t("nav.signOut")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          openProfileModal(e);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left block py-2 px-3 rounded-md font-sorani text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      >
                        {t("nav.createProfile") || "Create Profile"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};

export default Navbar; 