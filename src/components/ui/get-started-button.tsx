import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <div className="relative inline-block">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      {/* Button */}
      <Button className="group relative overflow-hidden shadow-2xl" size="lg">
        <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
          Get Started
        </span>
        <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
          <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
        </i>
      </Button>
    </div>
  );
}
