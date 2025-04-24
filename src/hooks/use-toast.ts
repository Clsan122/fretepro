
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type State = {
  toasts: ToastProps[];
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function toast(props: ToastProps) {
  const { variant } = props;
  
  if (variant === "destructive") {
    sonnerToast.error(props.title, {
      description: props.description,
      action: props.action,
    });
  } else if (variant === "success") {
    sonnerToast.success(props.title, {
      description: props.description,
      action: props.action,
    });
  } else {
    sonnerToast(props.title, {
      description: props.description,
      action: props.action,
    });
  }
}

export function useToast() {
  return {
    toast,
  };
}
