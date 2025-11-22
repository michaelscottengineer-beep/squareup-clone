import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  ChefHat,
  UtensilsCrossed,
  X,
  Edit,
} from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import EditOverlay from "./EditOverlay";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router";
import AdminPublishForUserButton from "../components/AdminPublishForUserButton";
import SaveTemplateButton from "../components/SaveTemplateButton";
import { IoOpen } from "react-icons/io5";
import ContactSection from "./ContactSection";

// Mock Data
const restaurantInfo = {
  name: "La Cuisine Royale",
  tagline: "Where Tradition Meets Innovation",
  description:
    "Experience the finest fusion of French and Asian cuisine in an elegant atmosphere. Our award-winning chefs create masterpieces that delight both the eyes and palate.",
  hours: "Mon-Sat: 11:00 AM - 10:00 PM | Sun: 12:00 PM - 9:00 PM",
  address: "123 Gourmet Street, Culinary District",
  phone: "+1 (555) 123-4567",
  email: "reservations@lacuisineroyale.com",
  rating: 4.8,
};

const featuredDishes = [
  {
    id: 1,
    name: "Truffle Risotto Supreme",
    description:
      "Creamy Arborio rice infused with black truffle, topped with parmesan and micro herbs",
    price: "$42",
    category: "Signature",
    image: "🍚",
    chef: "Chef Marie Laurent",
  },
  {
    id: 2,
    name: "Seared Wagyu Steak",
    description:
      "Premium A5 Wagyu beef with roasted garlic butter, seasonal vegetables, and red wine reduction",
    price: "$89",
    category: "Premium",
    image: "🥩",
    chef: "Chef Marco Rossi",
  },
  {
    id: 3,
    name: "Lobster Thermidor",
    description:
      "Fresh Atlantic lobster in a creamy cognac sauce, gratinated to perfection",
    price: "$65",
    category: "Signature",
    image: "🦞",
    chef: "Chef Marie Laurent",
  },
  {
    id: 4,
    name: "Miso Glazed Sea Bass",
    description:
      "Pan-seared Chilean sea bass with sweet miso glaze, bok choy, and jasmine rice",
    price: "$56",
    category: "Fusion",
    image: "🐟",
    chef: "Chef Kenji Tanaka",
  },
  {
    id: 5,
    name: "Wild Mushroom Wellington",
    description:
      "Puff pastry filled with assorted wild mushrooms, goat cheese, and herb duxelles",
    price: "$38",
    category: "Vegetarian",
    image: "🍄",
    chef: "Chef Marie Laurent",
  },
  {
    id: 6,
    name: "Chocolate Soufflé",
    description:
      "Decadent dark chocolate soufflé with vanilla bean ice cream and raspberry coulis",
    price: "$18",
    category: "Dessert",
    image: "🍫",
    chef: "Chef Pierre Dubois",
  },
];

const stats = [
  { label: "Years of Excellence", value: "15+" },
  { label: "Master Chefs", value: "8" },
  { label: "Signature Dishes", value: "50+" },
  { label: "Happy Guests", value: "50K+" },
];

interface RestaurantLandingProps {
  userId?: string;
  isEdit?: boolean;
}
export default function RestaurantLanding({
  userId,
  isEdit,
}: RestaurantLandingProps) {
  const navigation = useNavigate();
  const outerRef = useRef<HTMLDivElement>(null);
  const { templateId } = useParams();
  const [isEditing, setIsEditing] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const partEditorData = useEditorTemplateState(
    (state) => state.partEditorData
  );

  const categories = [
    "All",
    "Signature",
    "Premium",
    "Fusion",
    "Vegetarian",
    "Dessert",
  ];

  const filteredDishes =
    selectedCategory === "All"
      ? featuredDishes
      : featuredDishes.filter((dish) => dish.category === selectedCategory);

  // useEffect(() => {
  //   setIsEditing(!!isEdit);
  // }, [isEdit]);

  return (
    <>
      {userId && (
        <div className="w-full border-b border-border py-4 px-4 flex items-center gap-4">
          <Link
            to={"/websites/" + templateId}
            className="flex items-center underline"
            target="_blank"
          >
            <IoOpen className="" /> View Published Website
          </Link>
          {isEditing ? (
            <Button
              className="flex items-center gap-2 bg-yellow-100 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-500"
              onClick={() => setIsEditing(false)}
            >
              <X />
              Close Editing
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2 bg-yellow-100 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-500"
              onClick={() => setIsEditing(true)}
            >
              <Edit />
              Editing
            </Button>
          )}
        </div>
      )}
      <div
        className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100"
        ref={outerRef}
      >
        {/* Header/Nav */}
        <nav
          className={cn("shadow-sm sticky top-0 z-50", {
            hidden: !!partEditorData?.header.hidden.data?.isChecked,
          })}
          style={{
            ...partEditorData.header.general?.style,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: "inherit",
                    ...partEditorData?.header?.pageName.style,
                  }}
                >
                  {partEditorData?.header?.pageName.text}
                </span>
              </div>
              <div className="flex gap-4">
                {partEditorData.header.navigation.data?.items?.map(
                  (item: { label: string; url: string }) => {
                    return (
                      <Button
                        key={item.label}
                        className=""
                        onClick={() => item.url && navigation(item.url)}
                        variant={"link"}
                        style={{
                          color: "inherit",
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
            {isEditing && <EditOverlay partEditorKey={"header"} />}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-600 to-orange-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-white text-amber-600 hover:bg-white">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {restaurantInfo.rating} Rating
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {restaurantInfo.name}
              </h1>
              <p className="text-xl md:text-2xl mb-2 text-amber-100">
                {restaurantInfo.tagline}
              </p>
              <p className="text-lg mb-8 text-amber-50 max-w-2xl mx-auto">
                {restaurantInfo.description}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-amber-50"
                >
                  View Full Menu
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Dishes Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Our Signature Dishes
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Crafted with passion, served with excellence. Each dish tells a
                story of culinary artistry.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-amber-600 hover:bg-amber-700"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <Card
                  key={dish.id}
                  className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <CardHeader className="pb-4">
                    <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                      {dish.image}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{dish.name}</CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800"
                      >
                        {dish.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-600">
                      {dish.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-amber-600">
                          {dish.price}
                        </div>
                        <div className="text-sm text-slate-500">
                          {dish.chef}
                        </div>
                      </div>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  Our Story
                </h2>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Founded in 2009, La Cuisine Royale has been a beacon of
                  culinary excellence, bringing together the finest ingredients
                  and time-honored cooking techniques with modern innovation.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Our team of world-class chefs, led by Chef Marie Laurent,
                  creates unforgettable dining experiences that celebrate the
                  art of fine cuisine. Every dish is a testament to our
                  commitment to quality, creativity, and exceptional service.
                </p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Learn More About Us
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-100 rounded-lg p-8 text-center">
                  <ChefHat className="w-12 h-12 mx-auto mb-2 text-amber-600" />
                  <div className="font-semibold">Master Chefs</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-8 text-center">
                  <Star className="w-12 h-12 mx-auto mb-2 text-orange-600 fill-current" />
                  <div className="font-semibold">Award Winning</div>
                </div>
                <div className="bg-red-100 rounded-lg p-8 text-center">
                  <UtensilsCrossed className="w-12 h-12 mx-auto mb-2 text-red-600" />
                  <div className="font-semibold">Fine Dining</div>
                </div>
                <div className="bg-yellow-100 rounded-lg p-8 text-center">
                  <span className="text-4xl">🏆</span>
                  <div className="font-semibold mt-2">15+ Years</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection isEditing={isEditing} />

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© 2024 {restaurantInfo.name}. All rights reserved.</p>
            <p className="mt-2">Crafted with passion for culinary excellence</p>
          </div>
        </footer>
      </div>
      <AdminPublishForUserButton templateName="Test1" outerHTML={outerRef} />
      {isEditing && userId && <SaveTemplateButton outerHTMLRef={outerRef} />}
    </>
  );
}
