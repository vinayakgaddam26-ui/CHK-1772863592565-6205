import { fetchLiveEmissions } from '@/lib/integrations';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;
      
      const sendData = async () => {
        if (isClosed) return;
        try {
          const data = await fetchLiveEmissions();
          if (isClosed) return;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: true, data })}\n\n`));
        } catch (err: any) {
          if (isClosed) return;
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
        isClosed = true;
        clearInterval(interval);
        try {
            controller.close();
        } catch (e) {}
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
