import { ITodo } from "@/app/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { baseUrl } from "./Todo";

type Props = {
  todo: ITodo;
};

const ListItem = ({ todo }: Props) => {
  const queryClient = useQueryClient();
  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["update-todo"],
    mutationFn: async () => {
      // if (todo.completed) return alert("Already completed");
      try {
        const res = await fetch(`${baseUrl}/update-todo/${todo._id}`, {
          method: "PATCH",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-todos"],
      });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-todo"],
    mutationFn: async () => {
      // if (todo.completed) return alert("Already completed");
      try {
        const res = await fetch(`${baseUrl}/delete-todo/${todo._id}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-todos"],
      });
    },
  });

  return (
    <div className="flex gap-2">
      <div className="max-w-sm p-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 flex-1">
        <p className="font-normal text-gray-700 truncate flex-1">{todo.body} </p>
        <div className="min-w-fit">
          {!todo.completed && <p className="font-normal text-xs border p-1 rounded-lg bg-blue-200 text-blue-600 ">In-Process</p>}
          {todo.completed && <p className="font-normal text-xs border p-1 rounded-lg bg-green-200 text-green-600 ">Completed</p>}
        </div>
      </div>
      {todo.completed && (
        <button className="rounded-lg shadow hover:shadow-none text-white flex items-center p-2 bg-orange-400" disabled={isUpdating} onClick={() => updateTodo()}>
          UNDO
        </button>
      )}
      {!todo.completed && (
        <button className="rounded-lg shadow hover:shadow-none text-white flex items-center p-2 bg-blue-400" disabled={isUpdating} onClick={() => updateTodo()}>
          DONE
        </button>
      )}
      <button className="rounded-lg shadow hover:shadow-none text-white flex items-center p-2 bg-red-500" disabled={isDeleting} onClick={() => deleteTodo()}>
        DELETE
      </button>
    </div>
  );
};

export default ListItem;
