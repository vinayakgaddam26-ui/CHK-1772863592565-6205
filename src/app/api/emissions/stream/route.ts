import { fetchLiveEmissions } from '@/lib/integrations';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const sendData = async () => {
        try {
          const data = await fetchLiveEmissions();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: true, data })}\n\n`));
        } catch (err: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: false, error: err.message })}\n\n`));
        }
      };

      // Send initial data immediately
      await sendData();

      // Poll every 5 seconds for real-time updates
      const interval = setInterval(async () => {
        await sendData();
      }, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
