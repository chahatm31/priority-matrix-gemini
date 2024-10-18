// App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Helper function to add a task
const addTask = (text, quadrant, deadline = "", priority = "") => {
  fireEvent.change(screen.getByRole("textbox", { name: /add a task/i }), {
    target: { value: text },
  });
  fireEvent.change(screen.getByRole("combobox", { name: /select quadrant/i }), {
    target: { value: quadrant },
  });

  // Set deadline if provided
  if (deadline) {
    fireEvent.change(screen.getByRole("textbox", { name: /deadline/i }), {
      target: { value: deadline },
    });
  }
  // Set priority if provided
  if (priority) {
    fireEvent.change(screen.getByRole("combobox", { name: /priority/i }), {
      target: { value: priority },
    });
  }
  fireEvent.click(screen.getByRole("button", { name: /add task/i }));
};

// Helper function to get a task by its text content
const getTask = (text) => screen.getByText(text);

// Helper function to get the quadrant container by its heading
const getQuadrant = (heading) =>
  screen.getByRole("heading", { name: heading }).parentNode;

describe("Eisenhower Matrix App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("should allow users to add tasks and categorize them into quadrants (Requirement 1)", () => {
    addTask("Finish report", "urgentImportant");
    expect(getTask("Finish report")).toBeInTheDocument();
  });

  it("should allow users to drag and drop tasks between quadrants (Requirement 2)", async () => {
    addTask("Finish report", "urgentImportant");
    addTask("Read a book", "notUrgentImportant");

    const reportTask = getTask("Finish report");
    const bookTask = getTask("Read a book");
    const urgentNotImportantQuadrant = getQuadrant(/urgent & not important/i);

    // Drag and drop is difficult to test with RTL. This is a simplified simulation.
    fireEvent.dragStart(reportTask);
    fireEvent.drop(urgentNotImportantQuadrant);

    // Assert that the task has moved (this might need adjustments depending on your drag-and-drop implementation)
    await waitFor(() => {
      expect(urgentNotImportantQuadrant).toContainElement(reportTask);
    });
  });

  it("should display insights about time management (Requirement 3)", () => {
    addTask("Task 1", "notUrgentNotImportant");
    addTask("Task 2", "notUrgentNotImportant");

    expect(screen.getByText(/try to eliminate or minimize/i)).toBeVisible();
  });

  it("should allow users to mark tasks as completed (Requirement 4)", () => {
    addTask("Finish report", "urgentImportant");
    fireEvent.click(screen.getByRole("checkbox", { name: /finish report/i }));
    // Assert that the task is visually crossed out or moved to a "Completed" list
    expect(getTask("Finish report")).toHaveClass("completed"); // Replace 'completed' with your actual class name
  });

  it("should enable users to add deadlines for each task (Requirement 5)", () => {
    addTask("Submit proposal", "urgentImportant", "2024-10-25");
    // Assert that the deadline is associated with the task
    expect(getTask("Submit proposal")).toHaveAttribute(
      "data-deadline",
      "2024-10-25"
    ); // Or another way to access the deadline
  });

  it("should let users filter tasks by urgency, importance, or due date (Requirement 6)", () => {
    addTask("Finish report", "urgentImportant", "2024-10-25");
    addTask("Read a book", "notUrgentImportant", "2024-11-15");

    // Simulate filtering by urgency: "Urgent"
    fireEvent.click(screen.getByRole("button", { name: /filter by urgency/i })); // Replace with your actual filter button
    fireEvent.click(screen.getByRole("option", { name: /urgent/i }));
    expect(getTask("Finish report")).toBeVisible();
    expect(screen.queryByText("Read a book")).not.toBeInTheDocument();

    // Add similar filtering simulations for importance and due date
  });

  it("should display a progress indicator for each quadrant (Requirement 7)", () => {
    addTask("Task 1", "urgentImportant");
    addTask("Task 2", "urgentImportant");
    fireEvent.click(screen.getByRole("checkbox", { name: /task 1/i }));

    // Assert that the progress bar for the "Urgent & Important" quadrant shows 50%
    expect(screen.getByTestId("progress-urgentImportant")).toHaveTextContent(
      "50%"
    ); // Replace with your actual test id
  });

  it("should allow users to reset tasks for a fresh week (Requirement 8)", () => {
    addTask("Finish report", "urgentImportant", "2024-10-25");
    addTask("Plan 2024 strategy", "notUrgentImportant");

    fireEvent.click(screen.getByRole("button", { name: /reset week/i }));

    // Assert that the weekly task is removed
    expect(screen.queryByText("Finish report")).not.toBeInTheDocument();
    // Assert that the long-term task remains
    expect(getTask("Plan 2024 strategy")).toBeVisible();
  });

  it("should provide an option to delete or edit tasks (Requirement 9)", () => {
    addTask("Finish report", "urgentImportant");

    fireEvent.click(screen.getByRole("button", { name: /delete/i })); // Assuming you have a delete button for each task
    expect(screen.queryByText("Finish report")).not.toBeInTheDocument();

    // Add a test for editing tasks as well
  });

  it("should store tasks and progress offline (Requirement 10)", () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    addTask("Prepare presentation", "urgentImportant");

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "tasks",
      JSON.stringify([
        {
          text: "Prepare presentation",
          quadrant: "urgentImportant",
          completed: false,
          deadline: "",
          priority: "",
        },
      ]) // Adjust the task object as needed
    );

    // Add assertions to check if tasks are loaded from localStorage on component mount
  });

  it("should show a summary view of all objectives and tasks (Requirement 11)", () => {
    addTask("Task 1", "urgentImportant");
    addTask("Task 2", "urgentNotImportant");

    fireEvent.click(screen.getByRole("button", { name: /summary/i })); // Replace with your actual summary button

    // Assert that the summary view displays the correct number of tasks in each quadrant
    expect(screen.getByText(/urgent & important: 1/i)).toBeVisible(); // Adjust the text content as needed
    expect(screen.getByText(/urgent & not important: 1/i)).toBeVisible();
    // ... add assertions for other quadrants
  });

  it("should let users assign priorities to tasks within each quadrant (Requirement 12)", () => {
    addTask("Task 1", "urgentImportant", "", "high");
    addTask("Task 2", "urgentImportant", "", "low");

    // Assuming you have a way to sort tasks within a quadrant (e.g., a sort button)
    fireEvent.click(screen.getByRole("button", { name: /sort by priority/i })); // Replace with your actual sort button

    // Assert that tasks are sorted correctly within the "Urgent & Important" quadrant
    const urgentImportantTasks = screen.getAllByTestId("task-urgentImportant"); // Replace with your actual test id
    expect(urgentImportantTasks[0]).toHaveTextContent("Task 1"); // "Task 1" should be first because it has high priority
    expect(urgentImportantTasks[1]).toHaveTextContent("Task 2");
  });
});
