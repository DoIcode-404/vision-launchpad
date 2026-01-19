import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className={`font-heading font-bold text-lg leading-tight transition-colors ${isScrolled ? 'text-primary' : 'text-primary-foreground'}`}>
                The New Vision
              </span>
              <span className={`text-xs -mt-0.5 transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                Tuition Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? isScrolled ? "text-secondary font-semibold" : "text-secondary font-semibold"
                    : isScrolled ? "text-foreground hover:text-secondary" : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+9779869637226" className={`flex items-center gap-2 text-sm transition-colors ${isScrolled ? 'text-muted-foreground hover:text-primary' : 'text-primary-foreground/80 hover:text-primary-foreground'}`}>
              <Phone className="w-4 h-4" />
              <span>+977 9869637226</span>
            </a>
            <Button variant="hero" size="default" asChild>
              <Link to="/contact">Book Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-muted' : 'hover:bg-white/10'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-primary' : 'text-primary-foreground'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-primary' : 'text-primary-foreground'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-card rounded-xl shadow-lg p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 px-4 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-secondary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <a
                href="tel:+9779869637226"
                className="flex items-center gap-2 text-sm text-muted-foreground py-2 px-4"
              >
                <Phone className="w-4 h-4" />
                <span>+977 9869637226</span>
              </a>
              <Button variant="hero" className="w-full" asChild>
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
