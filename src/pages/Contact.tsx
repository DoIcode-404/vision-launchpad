import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentGrade: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        studentGrade: formData.studentGrade,
        subject: formData.subject,
        message: formData.message,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      toast({
        title: "Enquiry Submitted!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        studentGrade: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Have questions? We'd love to hear from you. Reach out for enquiries, 
              demo classes, or any information about our programs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a 
              href="tel:+9779869637226"
              className="card-elevated rounded-xl p-6 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <Phone className="w-6 h-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">Call Us</h3>
              <p className="text-muted-foreground text-sm">+977 9869637226</p>
            </a>

            <a 
              href="https://wa.me/9779869637226"
              target="_blank"
              rel="noopener noreferrer"
              className="card-elevated rounded-xl p-6 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                <MessageCircle className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Quick Response</p>
            </a>

            <a 
              href="mailto:info@newvision.edu"
              className="card-elevated rounded-xl p-6 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <Mail className="w-6 h-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">Email Us</h3>
              <p className="text-muted-foreground text-sm">info@newvision.edu</p>
            </a>

            <div className="card-elevated rounded-xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">Timings</h3>
              <p className="text-muted-foreground text-sm">Mon-Sat: 8AM - 8PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enquiry Form */}
            <div className="bg-card rounded-2xl p-8 shadow-xl">
              <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                Book a Free Demo Class
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill in your details and we'll get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your enquiry has been submitted successfully. Our team will contact you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        studentGrade: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Student/Parent Name *
                      </label>
                      <Input
                        required
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="+977 9869637226"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Student's Grade *
                      </label>
                      <Select 
                        required
                        value={formData.studentGrade}
                        onValueChange={(value) => handleChange("studentGrade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              Grade {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Subject of Interest
                      </label>
                      <Select 
                        value={formData.subject}
                        onValueChange={(value) => handleChange("subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="science">Science (6-10)</SelectItem>
                          <SelectItem value="ioe">IOE Entrance Prep</SelectItem>
                          <SelectItem value="iom">IOM Entrance Prep</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Any specific requirements or questions?"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Enquiry <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map & Address */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <div className="bg-muted rounded-2xl h-80 flex items-center justify-center overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28341.835553576985!2d82.29!3d27.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997b3a4a3c5d5a1%3A0x5a5b5c5d5e5f5g5h!2sLamhi%2C%20Dang!5e0!3m2!1sen!2snp!4v1629789876543!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The New Vision Location - Lamhi, Dang"
                  className="rounded-2xl"
                />
              </div>

              {/* Address Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      Our Location
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Lamhi, Dang<br />
                      Near Main Chowk, Tulsipur Road<br />
                      Lumbini Province, Nepal
                    </p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 text-sm font-medium mt-3 transition-colors"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>

              {/* Class Timings */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="font-heading font-semibold text-primary mb-4">
                  Class Timings
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Morning Batch</span>
                    <span className="font-medium text-foreground">8:00 AM - 10:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Afternoon Batch</span>
                    <span className="font-medium text-foreground">2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Evening Batch</span>
                    <span className="font-medium text-foreground">5:00 PM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Office Hours</span>
                    <span className="font-medium text-foreground">8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
