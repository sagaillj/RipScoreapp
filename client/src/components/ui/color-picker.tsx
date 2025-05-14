import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronUp, ChevronDown, Pipette } from 'lucide-react';
import ColorThief from 'colorthief';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  imageUrl?: string | null;
  label?: string;
}

export function ColorPicker({ value, onChange, imageUrl, label = "Color" }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(value);
  const [expanded, setExpanded] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>([]);

  // Convert RGB array to hex string
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Extract colors from image if available
  useEffect(() => {
    if (!imageUrl) {
      setDominantColors([]);
      return;
    }

    const extractColors = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 5);
            
            if (palette) {
              const hexColors = palette.map(color => rgbToHex(color[0], color[1], color[2]));
              setDominantColors(hexColors);
            }
          } catch (err) {
            console.error('Error extracting colors:', err);
          }
        };
        img.src = imageUrl;
      } catch (error) {
        console.error('Error loading image for color extraction:', error);
      }
    };

    extractColors();
  }, [imageUrl]);

  // Validate and format hex value
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setHexValue(input);
    
    // Only update the parent component if it's a valid hex
    if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
      onChange(input);
    }
  };

  // Format the hex value when the picker changes
  const handlePickerChange = (color: string) => {
    setHexValue(color);
    onChange(color);
  };

  // Format input value when losing focus
  const handleBlur = () => {
    let formattedHex = hexValue;
    
    // Add # if missing
    if (!hexValue.startsWith('#')) {
      formattedHex = '#' + hexValue;
    }
    
    // Ensure valid hex (if not, revert to previous value)
    if (!/^#[0-9A-Fa-f]{6}$/.test(formattedHex)) {
      setHexValue(value);
      return;
    }
    
    setHexValue(formattedHex);
    onChange(formattedHex);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full border border-[var(--color-border-post)]" 
          style={{ backgroundColor: hexValue }}
        />
        <div className="flex-1 relative">
          <Input
            value={hexValue}
            onChange={handleHexChange}
            onBlur={handleBlur}
            className="pr-14"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-xs text-[var(--color-muted-post)] mr-2">HEX</span>
            <button 
              className="h-5 w-5 flex items-center justify-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="py-3 space-y-4">
          <HexColorPicker color={hexValue} onChange={handlePickerChange} />
          
          {dominantColors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-[var(--color-muted-post)]">Colors from logo</Label>
              <div className="flex items-center gap-2">
                {dominantColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full border border-[var(--color-border-post)] hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setHexValue(color);
                      onChange(color);
                    }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 rounded-full" 
                  onClick={() => {
                    if (dominantColors.length > 0) {
                      setHexValue(dominantColors[0]);
                      onChange(dominantColors[0]);
                    }
                  }}
                >
                  <Pipette size={15} className="text-[var(--color-muted-post)]" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}