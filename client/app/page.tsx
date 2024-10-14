"use client";

import Todo from "@/components/Todo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ITodo {
  _id: string;
  completed: boolean;
  body: string;
}

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  );
}
