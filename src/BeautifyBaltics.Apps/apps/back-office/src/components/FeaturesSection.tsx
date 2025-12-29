import { Card } from "@/components/ui/card";
import { Calendar, Shield, Star, Image } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments instantly with real-time availability updates",
    },
    {
      icon: Image,
      title: "Portfolio Showcase",
      description: "Browse master portfolios to find the perfect match for your style",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read authentic reviews from real customers to make informed decisions",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe and secure booking with verified professionals only",
    },
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Why Choose BeautySpot
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover and book the best beauty professionals in your area
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
