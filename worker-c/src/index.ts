export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      // switch to a GET request
      return env.NEXT_WORKER.fetch("https://internal.my-network.local");
    } else {
      return new Response(`Hello World! ${request.url}`);
    }
  },
} satisfies ExportedHandler<Env>;
