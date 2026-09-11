import { executeStatutoryComplianceEngine } from '../src/api/compliance';

export default async function handler(req: any, res: any) {
  // Support CORS if needed
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  }

  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return new Response(null, { status: 200 });
  }

  if (req.method !== 'POST') {
    if (res && typeof res.status === 'function') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep as is
      }
    }

    const taskType = body?.taskType || 'HIRA';
    const siteContext = body?.siteContext || 'Gauteng Forecourt Retail Service Station';
    const hazards = body?.hazards || 'General Forecourt Risk Assessment';

    const result = await executeStatutoryComplianceEngine({ taskType, siteContext, hazards });

    if (res && typeof res.status === 'function') {
      return res.status(200).json(result);
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[API /api/compliance Error]', error);
    const errorResponse = {
      success: false,
      error: error?.message || 'Failed to process statutory compliance request',
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorResponse);
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
