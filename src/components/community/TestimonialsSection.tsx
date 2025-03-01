
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote: "AccessPath has completely changed how I navigate my city. For the first time, I can plan trips with confidence knowing I'll have accessible routes.",
    name: "Sarah Johnson",
    role: "Wheelchair user for 15 years",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  {
    quote: "As a caregiver, I rely on AccessPath to find wheelchair-accessible routes when taking my mother out. The community updates about broken elevators have saved us so many times!",
    name: "Michael Chen",
    role: "Caregiver",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  {
    quote: "The detailed information about accessible entrances and elevators has made it possible for me to visit places I would have avoided before. It's empowering.",
    name: "Emily Rodriguez",
    role: "Mobility aid user",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
  }
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  
  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };
  
  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Voices from our community</h2>
          <p className="text-xl text-gray-600">
            Hear from people who are using AccessPath to navigate their world with confidence.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-8 left-8 text-7xl text-accessBlue opacity-20">
            <Quote />
          </div>
          
          <div className="relative z-10 bg-white rounded-2xl shadow-elevation-2 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-elevation-1">
                <img 
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="flex-1">
                <blockquote className="text-xl md:text-2xl mb-6 text-gray-800">
                  "{testimonials[current].quote}"
                </blockquote>
                
                <div>
                  <p className="font-semibold text-lg">{testimonials[current].name}</p>
                  <p className="text-gray-600">{testimonials[current].role}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8 space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prev}
                className="rounded-full h-10 w-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={next}
                className="rounded-full h-10 w-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
