"use client";

export function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Gold particle dots - Greatly increased size, brightness, and intense glow for maximum visibility */}
      <div className="animate-float-particle absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-gold-300 [animation-delay:0s] shadow-[0_0_15px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[25%] top-[55%] h-4 w-4 rounded-full bg-yellow-200 [animation-delay:2s] shadow-[0_0_20px_rgba(254,240,138,1)]" />
      <div className="animate-float-particle absolute left-[45%] top-[25%] h-3 w-3 rounded-full bg-amber-200 [animation-delay:4s] shadow-[0_0_15px_rgba(253,230,138,1)]" />
      <div className="animate-float-particle absolute left-[70%] top-[65%] h-4 w-4 rounded-full bg-gold-200 [animation-delay:6s] shadow-[0_0_20px_rgba(254,236,139,1)]" />
      <div className="animate-float-particle absolute left-[55%] top-[40%] h-3 w-3 rounded-full bg-yellow-300 [animation-delay:8s] shadow-[0_0_15px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[85%] top-[30%] h-4 w-4 rounded-full bg-gold-300 [animation-delay:10s] shadow-[0_0_15px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[15%] top-[75%] h-3 w-3 rounded-full bg-amber-300 [animation-delay:1s] shadow-[0_0_15px_rgba(252,211,77,1)]" />
      <div className="animate-float-particle absolute left-[90%] top-[50%] h-3 w-3 rounded-full bg-gold-200 [animation-delay:3s] shadow-[0_0_15px_rgba(254,236,139,1)]" />
      <div className="animate-float-particle absolute left-[40%] top-[85%] h-5 w-5 rounded-full bg-yellow-200 [animation-delay:5s] shadow-[0_0_25px_rgba(254,240,138,1)]" />
      <div className="animate-float-particle absolute left-[60%] top-[10%] h-4 w-4 rounded-full bg-amber-200 [animation-delay:7s] shadow-[0_0_20px_rgba(253,230,138,1)]" />
      
      {/* Additional denser, brighter dots */}
      <div className="animate-float-particle absolute left-[20%] top-[35%] h-3 w-3 rounded-full bg-gold-300 [animation-delay:1.5s] shadow-[0_0_15px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[80%] top-[15%] h-4 w-4 rounded-full bg-yellow-200 [animation-delay:3.5s] shadow-[0_0_20px_rgba(254,240,138,1)]" />
      <div className="animate-float-particle absolute left-[35%] top-[15%] h-3 w-3 rounded-full bg-amber-200 [animation-delay:5.5s] shadow-[0_0_15px_rgba(253,230,138,1)]" />
      <div className="animate-float-particle absolute left-[75%] top-[85%] h-4 w-4 rounded-full bg-gold-200 [animation-delay:7.5s] shadow-[0_0_20px_rgba(254,236,139,1)]" />
      <div className="animate-float-particle absolute left-[5%] top-[45%] h-3 w-3 rounded-full bg-yellow-300 [animation-delay:9.5s] shadow-[0_0_15px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[95%] top-[80%] h-4 w-4 rounded-full bg-gold-300 [animation-delay:2.5s] shadow-[0_0_20px_rgba(253,224,71,1)]" />
      <div className="animate-float-particle absolute left-[50%] top-[90%] h-3 w-3 rounded-full bg-amber-300 [animation-delay:4.5s] shadow-[0_0_15px_rgba(252,211,77,1)]" />
      <div className="animate-float-particle absolute left-[30%] top-[70%] h-3 w-3 rounded-full bg-gold-200 [animation-delay:6.5s] shadow-[0_0_15px_rgba(254,236,139,1)]" />

      {/* Drifting ambient ring shapes */}
      <div className="animate-drift absolute right-[8%] top-[20%] h-20 w-20 rounded-full border-[3px] border-gold-300/40 shadow-[0_0_20px_rgba(253,224,71,0.2)] [animation-delay:0s]" />
      <div className="animate-drift absolute left-[5%] bottom-[25%] h-28 w-28 rounded-full border-[3px] border-amber-200/40 shadow-[0_0_20px_rgba(253,230,138,0.2)] [animation-delay:4s]" />
      <div className="animate-drift absolute left-[50%] top-[60%] h-16 w-16 rounded-full border-[3px] border-yellow-200/40 shadow-[0_0_20px_rgba(254,240,138,0.2)] [animation-delay:2s]" />
    </div>
  );
}
