import { useState } from "react";
import { useNavigate } from '@tanstack/react-router';
import { Search, MapPin, Filter, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import MapView from "@/components/MapView";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Explore = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 200]);
  
  const categories = [
    { id: "all", label: "All Services" },
    { id: "barber", label: "Barbers" },
    { id: "tattoo", label: "Tattoo Artists" },
    { id: "nails", label: "Nail Artists" },
    { id: "makeup", label: "Makeup Artists" },
  ];

  const masters = [
    {
      id: 1,
      name: "Elena's Barbershop",
      category: "barber",
      rating: 4.9,
      reviews: 127,
      price: "$$",
      priceValue: 35,
      image: "/placeholder.svg",
      location: { lat: 40.7128, lng: -74.0060 },
      address: "Downtown Manhattan",
    },
    {
      id: 2,
      name: "Ink Masters Studio",
      category: "tattoo",
      rating: 4.8,
      reviews: 89,
      price: "$$$",
      priceValue: 150,
      image: "/placeholder.svg",
      location: { lat: 40.7580, lng: -73.9855 },
      address: "Midtown West",
    },
    {
      id: 3,
      name: "Luxe Nails & Spa",
      category: "nails",
      rating: 4.7,
      reviews: 203,
      price: "$$",
      priceValue: 45,
      image: "/placeholder.svg",
      location: { lat: 40.7489, lng: -73.9680 },
      address: "East Village",
    },
    {
      id: 4,
      name: "Glamour Beauty Bar",
      category: "makeup",
      rating: 4.9,
      reviews: 156,
      price: "$$$",
      priceValue: 120,
      image: "/placeholder.svg",
      location: { lat: 40.7614, lng: -73.9776 },
      address: "Upper West Side",
    },
    {
      id: 5,
      name: "Classic Cuts",
      category: "barber",
      rating: 4.6,
      reviews: 94,
      price: "$",
      priceValue: 25,
      image: "/placeholder.svg",
      location: { lat: 40.7282, lng: -73.9942 },
      address: "Lower East Side",
    },
  ];

  const filteredMasters = masters.filter(master => {
    const categoryMatch = selectedCategory === "all" || master.category === selectedCategory;
    const priceMatch = master.priceValue >= priceRange[0] && master.priceValue <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const handleMarkerClick = (master: typeof masters[0]) => {
    setSelectedMaster(master.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
              BeautySpot
            </a>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service, master, or location..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect beauty master
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price Range
                    </Label>
                    <div className="pt-4 pb-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4 h-fit max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
            {filteredMasters.map((master) => (
              <Card 
                key={master.id} 
                className={`p-4 hover:shadow-lg transition-all cursor-pointer ${
                  selectedMaster === master.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => navigate({ to: '/master/$masterId', params: { masterId: String(master.id) } })}
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={master.image}
                      alt={master.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{master.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium text-foreground">{master.rating}</span>
                        <span>({master.reviews})</span>
                      </div>
                      <span>•</span>
                      <span>{master.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{master.address}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-[600px]">
            <MapView masters={filteredMasters} onMarkerClick={handleMarkerClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
