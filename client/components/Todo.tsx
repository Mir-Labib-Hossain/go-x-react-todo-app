import React from "react";
import ListItem from "./ListItem";
import TaskInput from "./TaskInput";
import { useQuery } from "@tanstack/react-query";
import { ITodo } from "@/app/page";

export const baseUrl = "http://localhost:5000/api";

const Todo = () => {
  const { data: todos = [], isLoading } = useQuery<ITodo[]>({
    queryKey: ["get-todos"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/get-todos`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data || [];
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] mx-auto flex flex-col gap-2">
        <TaskInput />
        {isLoading && <h1>Loading</h1>}
        {todos.map((todo) => (
          <ListItem todo={todo} key={todo._id} />
        ))}
      </div>
    </div>
  );
};

export default Todo;
