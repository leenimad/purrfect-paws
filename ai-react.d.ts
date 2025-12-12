// File: ai-react.d.ts

declare module 'ai/react' {
  import { type UseCompletionOptions } from 'ai';

  export function useCompletion(
    options?: UseCompletionOptions
  ): {
    completion: string;
    complete: (prompt: string) => Promise<string | null | undefined>;
    error: undefined | Error;
    isLoading: boolean;
    // Add other properties you might use from the hook if needed
  };

  // You can also declare other exports from 'ai/react' here if you use them
}