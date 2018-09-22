// 1. Make sure to import 'vue' before declaring augmented types
import Vue from 'vue'

export interface NotificationOptions {
  title?: string;
  text?: string;
  type?: string;
  group?: string;
  duration?: number;
  speed?: number;
  data?: object;
  clean?: boolean;
}

declare module 'vue/types/vue' {
  interface Vue {
      $notify: (options: NotificationOptions | string) => void;
  }
}

