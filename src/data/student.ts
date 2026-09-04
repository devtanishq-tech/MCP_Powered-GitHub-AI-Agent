const today = new Date().toISOString().split("T")[0];

const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const lastWeek = new Date(Date.now() - 7 * 86400000)
  .toISOString()
  .split("T")[0];

const lastMonth = new Date(Date.now() - 30 * 86400000)
  .toISOString()
  .split("T")[0];

export const students = [
  {
    id: "STU001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    joinedAt: yesterday,
  },
  {
    id: "STU002",
    name: "Priya Singh",
    email: "priya@example.com",
    joinedAt: lastWeek,
  },
  {
    id: "STU003",
    name: "Aman Kumar",
    email: "aman@example.com",
    joinedAt: lastMonth,
  },
  {
    id: "STU004",
    name: "Neha Verma",
    email: "neha@example.com",
    joinedAt: yesterday,
  },
  {
    id: "STU005",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    joinedAt: lastWeek,
  },
  {
    id: "STU006",
    name: "Anjali Gupta",
    email: "anjali@example.com",
    joinedAt: lastMonth,
  },
  {
    id: "STU007",
    name: "Rohan Das",
    email: "rohan@example.com",
    joinedAt: yesterday,
  },
  {
    id: "STU008",
    name: "Sneha Kapoor",
    email: "sneha@example.com",
    joinedAt: lastWeek,
  },
  {
    id: "STU009",
    name: "Vikas Yadav",
    email: "vikas@example.com",
    joinedAt: lastMonth,
  },
  {
    id: "STU010",
    name: "Pooja Malhotra",
    email: "pooja@example.com",
    joinedAt: yesterday,
  },
];
