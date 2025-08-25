// src/components/ui/toaster.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right" duration={3000}>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}

      {/* Bottom-centered viewport, lifted above the bottom nav */}
      <ToastViewport
        className={[
          "fixed z-[100]",
          "left-1/2 -translate-x-1/2",
          "bottom-[var(--toast-bottom-offset)]",
          "m-0 p-0",
          "w-full max-w-sm",
          "flex flex-col gap-2 outline-none",
        ].join(" ")}
      />
    </ToastProvider>
  );
}