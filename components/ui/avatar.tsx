"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

// Custom LogoAvatar for circular logo cropping
interface LogoAvatarProps {
  src: string;
  alt: string;
  size?: number;
  cropBottom?: boolean;
}

export function LogoAvatar({ src, alt, size = 48, cropBottom = false }: LogoAvatarProps) {
  return (
    <Avatar style={{ width: size, height: size }} className="border-2 border-gray-300 shadow-lg bg-white">
      <AvatarImage
        src={src}
        alt={alt}
        className={cropBottom ? "object-cover" : "object-cover"}
        style={cropBottom ? { objectPosition: `center 40%` } : { objectPosition: 'center' }}
      />
      <AvatarFallback>{alt?.[0] || "A"}</AvatarFallback>
    </Avatar>
  );
}
