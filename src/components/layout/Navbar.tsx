import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Faculty", path: "/faculty" },
  { name: "Results", path: "/results" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg py-2"
          : "bg-primary/95 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="The New Vision Tuition Center"
              className="h-12 w-auto object-contain bg-white rounded-full p-1"
            />
            <div className="flex flex-col">
              <span
                className={`font-heading font-bold text-lg leading-tight transition-colors ${isScrolled ? "text-primary" : "text-primary-foreground"}`}
              >
                The New Vision
              </span>
              <span
                className={`text-xs -mt-0.5 transition-colors ${isScrolled ? "text-muted-foreground" : "text-primary-foreground/70"}`}
              >
                Tuition Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? isScrolled
                      ? "text-secondary font-semibold"
                      : "text-secondary font-semibold"
                    : isScrolled
                      ? "text-foreground hover:text-secondary"
                      : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+9779869637226"
              className={`flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105 ${isScrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              <Phone className="w-4 h-4 animate-pulse" />
              <span>+977 9869637226</span>
            </a>
            <Button
              variant="hero"
              size="default"
              asChild
              className="hover:scale-105 transition-transform btn-ripple"
            >
              <Link to="/contact">Book Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "hover:bg-muted" : "hover:bg-white/10"}`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X
                className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-primary-foreground"}`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-primary-foreground"}`}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-card rounded-xl shadow-lg p-4 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 rounded-lg transition-all duration-300 transform ${
                  location.pathname === link.path
                    ? "bg-secondary/10 text-primary font-semibold scale-[1.02]"
                    : "text-foreground hover:bg-muted hover:translate-x-2"
                } ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <a
                href="tel:+9779869637226"
                className="flex items-center gap-2 text-sm text-muted-foreground py-2 px-4 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+977 9869637226</span>
              </a>
              <Button
                variant="hero"
                className="w-full hover:scale-[1.02] transition-transform"
                asChild
              >
                <Link to="/contact">Book Free Demo Class</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
