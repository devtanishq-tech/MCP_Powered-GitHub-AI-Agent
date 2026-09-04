import type { McpServer } from "@modelcontextprotocol/server";
import z from "zod";

import { students } from "../data/student";
import { actor } from "../data/actors";

export function registerCoreTools(server: McpServer) {
  server.registerTool(
    "enrolled_students",
    {
      description: "Get the list of students with enrollment information.",
      inputSchema: z.object({
        limit: z
          .number()
          .optional()
          .describe("Maximum number of students to return"),
      }),
    },
    async ({ limit }) => {
      const result = limit ? students.slice(0, limit) : students;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );

  server.registerTool(
    "weather_check",
    {
      description: "Used to find the current and latest weather report.",
      inputSchema: z.object({
        city: z.string().describe("Name of the city"),
      }),
    },
    async ({ city }) => {
      return {
        content: [
          {
            type: "text",
            text: `Current weather of ${city} is 25 °C`,
          },
        ],
      };
    },
  );

  server.registerTool(
    "web_search",
    {
      description: "Used to search real-time data on the internet.",
      inputSchema: z.object({
        query: z.string().describe("Query that needs to be searched"),
      }),
    },
    async ({ query }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query,
              result: "HI THERE",
            }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "actor_details",
    {
      description: "Used to find actor details.",
      inputSchema: z.object({
        totalNumber: z
          .number()
          .optional()
          .describe("Maximum number of actor records"),
      }),
    },
    async ({ totalNumber }) => {
      const result = totalNumber ? actor.slice(0, totalNumber) : actor;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );
}
