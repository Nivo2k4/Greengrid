import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Homeowner",
      location: "Green Valley District",
      content: "GreenGrid has completely transformed how we handle waste in our neighborhood. The real-time tracking means I never miss pickup days, and the app makes requesting special collections so easy. It's incredible to see the positive environmental impact we're making together.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b192?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Local Business Owner",
      location: "Downtown Commercial Zone",
      content: "As a restaurant owner, managing waste efficiently is crucial for our operations. GreenGrid's platform helps us schedule bulk pickups and track our recycling efforts. The transparency and reliability have been game-changers for our business sustainability goals.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Environmental Coordinator",
      location: "Riverside Community",
      content: "The community dashboard feature is fantastic! We can see exactly how much we're recycling and where we can improve. GreenGrid has helped increase our recycling rate by 40% in just six months. The residents love the transparency and ease of use.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Park",
      role: "Property Manager",
      location: "Sunset Heights Complex",
      content: "Managing waste collection for a 200-unit complex used to be a nightmare. Now with GreenGrid, I can coordinate pickups, handle resident requests, and track our environmental impact all from one platform. It's saved us time and significantly reduced complaints.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#2E7D32]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from residents, businesses, and community leaders who are making a difference with GreenGrid
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <Card 
            className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-[#2E7D32]" />
              </div>

              {/* Content */}
              <div className="space-y-8">
                {/* Stars Rating */}
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center italic">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-[#2E7D32] font-medium">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6">
            <Button
              onClick={prevTestimonial}
              size="sm"
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-[#2E7D32] text-gray-600 hover:text-[#2E7D32] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6">
            <Button
              onClick={nextTestimonial}
              size="sm"
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-[#2E7D32] text-gray-600 hover:text-[#2E7D32] transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#2E7D32] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2E7D32] transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}