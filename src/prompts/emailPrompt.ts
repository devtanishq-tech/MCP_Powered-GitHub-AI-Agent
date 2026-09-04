import type { McpServer } from "@modelcontextprotocol/server";
import z from "zod";

export function registerEmailPrompt(server: McpServer) {
  server.registerPrompt(
    "send_email_prompt",
    {
      title: "Send Email",
      description:
        "Used whenever there is a query related to sending an email.",
      argsSchema: z.object({
        to: z.string().describe("Whom the user is trying to send an email to"),
        subject: z.string().describe("Subject of the email"),
        body: z.string().describe("Main content of the email"),
      }),
    },
    async ({ to, subject, body }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a draft email where you are sending the email to ${to},
with the subject ${subject} and body content ${body}.
Rewrite or correct the body of the email where necessary.`,
            },
          },
        ],
      };
    },
  );
}
