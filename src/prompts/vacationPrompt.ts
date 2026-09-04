import type { McpServer } from "@modelcontextprotocol/server";
import z from "zod";

export function registerVacationPrompt(server: McpServer) {
  server.registerPrompt(
    "vacation_planning",
    {
      title: "Vacation Planning",
      description: "Used to plan and process vacation planning.",
      argsSchema: {
        duration: z.string().describe("Duration in days for the trip"),
        destination: z.string().describe("Destination you want to visit"),
        interests: z.array(z.string().describe("List of interests")),
        budget: z.string().describe("How much money you are spending"),
      },
    },
    async ({ destination, budget, duration, interests }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Plan a ${duration}-day vacation to ${destination}.
Budget: ${budget ? `$${budget}` : "flexible"}
Interests: ${interests.join(", ")}
Please suggest an itinerary, accommodations, and activities.`,
            },
          },
        ],
      };
    },
  );
}
