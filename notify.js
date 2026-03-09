export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'Resend key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { email, score, catScores } = await req.json();

    const categoryRows = Object.entries(catScores || {})
      .sort((a, b) => a[1] - b[1])
      .map(([cat, s]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;">${cat}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:bold;color:${s >= 70 ? '#00C6A0' : s >= 45 ? '#F59E0B' : '#EF4444'}">${s}/100</td></tr>`)
      .join('');

    const scoreColor = score >= 75 ? '#00C6A0' : score >= 50 ? '#F59E0B' : '#EF4444';

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: 'Series A Score <onboarding@resend.dev>',
        to: ['ahmet@unicorncfo.com'],
        subject: `🎯 New Lead: ${email} scored ${score}/100`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <div style="background:#0A0F1E;padding:24px;border-radius:12px;margin-bottom:24px;">
              <h1 style="color:#00C6A0;margin:0;font-size:20px;">New Series A Assessment</h1>
            </div>

            <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:20px;text-align:center;">
              <p style="margin:0 0 8px;color:#64748B;font-size:13px;letter-spacing:2px;">OVERALL SCORE</p>
              <span style="font-size:56px;font-weight:900;color:${scoreColor};">${score}</span>
              <span style="font-size:24px;color:#94A3B8;">/100</span>
            </div>

            <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:20px;">
              <p style="margin:0 0 12px;font-weight:700;color:#1E293B;">Lead Details</p>
              <p style="margin:0;color:#475569;"><strong>Email:</strong> ${email}</p>
            </div>

            <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-weight:700;color:#1E293B;">Score Breakdown</p>
              <table style="width:100%;border-collapse:collapse;">
                ${categoryRows}
              </table>
            </div>

            <div style="text-align:center;">
              <a href="https://calendly.com/ahmet-unicorncfo/30min" style="background:#00C6A0;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
                View Calendly →
              </a>
            </div>

            <p style="color:#94A3B8;font-size:12px;text-align:center;margin-top:24px;">
              Sent from seriesa.unicorncfo.com
            </p>
          </div>
        `
      })
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
