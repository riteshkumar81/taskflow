const API_URL = "https://taskflow-api-nl78.onrender.com/api";

const getToken = () => localStorage.getItem("taskflow_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// LOGIN
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (data.token) {
    localStorage.setItem("taskflow_token", data.token);
  }

  return data;
};

// GET TASKS
export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: authHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to load tasks")
  }

  return Array.isArray(data.tasks) ? data.tasks : []
}
// CREATE TASK
export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
};

// UPDATE TASK
export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data.task;
};

// DELETE TASK
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }

  return data;
};

// TOGGLE COMPLETION
export const toggleTaskCompletion = async (task) => {
  const newStatus =
    task.status === "completed" ? "pending" : "completed";

  return updateTask(task._id || task.id, {
    ...task,
    status: newStatus,
  });
};

// CALCULATE STATISTICS
export const getStats = (tasks = []) => {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    overdue: tasks.filter((task) => isTaskOverdue(task)).length,
  };
};

// CHECK OVERDUE
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === "completed") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
};
// REGISTER USER
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};
// GET CURRENT USER
export const getCurrentUser = async () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    localStorage.removeItem("taskflow_token");
    return null;
  }

  const data = await response.json();

  return data.user;
};
// LOGOUT USER
export const logoutUser = () => {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_current_user_v1");
};
