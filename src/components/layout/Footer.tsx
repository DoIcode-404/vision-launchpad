import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Faculty", path: "/faculty" },
    { name: "Results", path: "/results" },
    { name: "Contact", path: "/contact" },
  ];

  const courses = [
    "Mathematics (6-12)",
    "Science (6-10)",
    "Physics (11-12)",
    "Chemistry (11-12)",
    "Biology (11-12)",
    "Competitive Exams",
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="relative -top-10">
          <div className="bg-secondary/90 backdrop-blur rounded-xl px-6 py-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-base md:text-lg font-semibold text-secondary-foreground">
                    Ready to Excel?
                  </h3>
                  <p className="text-secondary-foreground/70 text-xs">
                    Book a free demo class today
                  </p>
                </div>
              </div>
              <Button 
                variant="default" 
                size="sm" 
                className="shrink-0 bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/contact" className="flex items-center gap-1.5 text-sm">
                  Book Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl leading-tight">
                  The New Vision
                </span>
                <span className="text-xs text-primary-foreground/70 -mt-0.5">
                  Tuition Center
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Empowering students for over a decade with quality education, 
              experienced faculty, and personalized attention for academic excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Our Courses</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course}>
                  <span className="text-primary-foreground/80 text-sm flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    {course}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Lamhi, Dang,
                  <br />
                  Lumbini Province, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a
                  href="tel:+9779869637226"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  +977 9869637226
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a
                  href="mailto:info@newvision.edu"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  info@newvision.edu
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Sun - Fri: 8:00 AM - 8:00 PM
                  <br />
                  Saturday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} The New Vision Tuition Center. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
