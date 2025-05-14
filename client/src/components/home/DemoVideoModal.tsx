import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { PlayCircle } from 'lucide-react';

interface DemoVideoModalProps {
  videoSrc?: string;
}

export function DemoVideoModal({ videoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ" }: DemoVideoModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        size="xl" 
        variant="outline" 
        className="text-white border-[#FF5CB3]/50 hover:bg-[#FF5CB3]/10"
        onClick={() => setOpen(true)}
      >
        Watch Demo
        <PlayCircle className="ml-2 h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="backdrop-blur-sm bg-black/60" />
        <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none">
          <div className="sr-only">
            <DialogTitle>RipScore Product Demo</DialogTitle>
            <DialogDescription>Watch our product demonstration video to see RipScore in action</DialogDescription>
          </div>
          <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
            <iframe 
              src={videoSrc}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Product Demo Video"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}