package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {
	app := fiber.New()
	todos := []Todo{}

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading envs")
	}

	PORT := os.Getenv("PORT")
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})
	app.Post("/create-todo", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil {
			return err
		}
		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Body is required"})
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		fmt.Println("created", todos)
		return c.Status(201).JSON(todo)
		// return nil
	})

	app.Patch("/update-todo/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for i, todo := range todos {
			cId, error := strconv.Atoi(id)
			if error == nil && todo.ID == cId {
				todos[i].Completed = !todos[i].Completed
				return c.Status(200).JSON(todos[i])
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})

	})

	app.Delete("/delete-todo/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for i, todo := range todos {
			fmt.Println("", todo, (todo.ID), "x", id)
			cId, error := strconv.Atoi(id)
			if error == nil && todo.ID == cId {
				todos = append(todos[:i], todos[i+1:]...)
				return c.Status(200).JSON("Deleted")
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	})
	log.Fatal(app.Listen(":" + PORT))
}
