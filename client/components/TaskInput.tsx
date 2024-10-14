import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { baseUrl } from "./Todo";

const TaskInput = () => {
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();
  const { mutate, isPending: isCreating } = useMutation({
    mutationKey: ["create-todo"],
    mutationFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/create-todo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: value }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      setValue("");
      queryClient.invalidateQueries({
        queryKey: ["get-todos"],
      });
    },
  });

  return (
    <form className="flex gap-2 w-full">
      <input type="text" name="todo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter New Task . . ." required onChange={(e) => setValue(e.target.value)} />
      <button className="rounded-lg shadow hover:shadow-none text-white flex items-center p-2 bg-green-400" type="submit" disabled={isCreating} onClick={() => mutate()}>
        ADD
      </button>
    </form>
  );
};

export default TaskInput;
