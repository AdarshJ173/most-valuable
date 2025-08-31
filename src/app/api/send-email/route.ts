import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const resend = new Resend(process.env.RESEND_API_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authorization = req.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.ADMIN_TOKEN}`;
    
    if (!authorization || authorization !== expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { entryId, email, type } = body;

    if (!entryId || !email || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: entryId, email, type' },
        { status: 400 }
      );
    }

    if (type !== 'purchase_confirmation') {
      return NextResponse.json(
        { error: 'Invalid email type. Only purchase_confirmation is supported.' },
        { status: 400 }
      );
    }

    // Get entry details from Convex
    const entry = await convex.query(api.entries.getEntryById, { entryId });
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Get raffle configuration
    const raffle = await convex.query(api.payments.getRaffleConfigInternal, {});
    if (!raffle) {
      return NextResponse.json(
        { error: 'No active raffle found' },
        { status: 404 }
      );
    }

    // Calculate campaign end date (format as readable date)
    const endDate = new Date(raffle.endDate);
    const endDateFormatted = endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Get order number (use entry ID or create a readable format)
    const orderNumber = entryId.substring(entryId.length - 8).toUpperCase();

    // Create the HTML email template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gold Rush Entry Confirmed - Most Valuable</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        .title {
            color: #d4af37;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .details-box {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            color: #1a1a1a;
            font-weight: 500;
        }
        .details-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #1a1a1a;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .details-list li strong {
            color: #1a1a1a;
        }
        .steps {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .steps h3 {
            color: #1a1a1a;
            margin: 0 0 20px 0;
            font-size: 18px;
        }
        .steps ol {
            margin: 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 12px 0;
            color: #555;
        }
        .highlight {
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .email-container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">MV</div>
            <h1 class="title">🏆 Gold Rush Entry Confirmed!</h1>
            <p class="subtitle">Your entry has been confirmed for "The Gold Rush Giveaway" — a historical release of two one-of-one shirts, each backed by a quarter ounce of gold (7g).</p>
        </div>

        <p>You now officially hold a chance to secure what no one else in the world can claim: <strong>real luxury, built on lasting value.</strong></p>

        <div class="details-box">
            <h3>📋 Your Entry Details</h3>
            <ul class="details-list">
                <li><span>Entry ID:</span> <strong>${orderNumber}</strong></li>
                <li><span>Entries Purchased:</span> <strong>${entry.count}</strong></li>
                <li><span>Campaign Ends:</span> <strong>${endDateFormatted}</strong></li>
                ${entry.variantColor ? `<li><span>Shirt Color:</span> <strong style="text-transform: capitalize;">${entry.variantColor}</strong></li>` : ''}
                ${entry.size ? `<li><span>Shirt Size:</span> <strong>${entry.size}</strong></li>` : ''}
            </ul>
        </div>

        <div class="steps">
            <h3>What happens next?</h3>
            <ol>
                <li><strong>Keep an eye on your inbox and Instagram</strong> — we'll update the community as the Gold Rush builds.</li>
                <li><strong>On ${endDateFormatted}</strong>, we will announce the two collectors chosen to receive the gold-backed shirts.</li>
                <li><strong>All other participants</strong> will receive their Digital Gold Brick Voucher ($250 off next release) as a token of appreciation for fueling this movement.</li>
            </ol>
        </div>

        <div class="highlight">
            <p style="margin: 0; font-size: 18px; font-weight: 600;">This isn't hype. This is history.</p>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for being one of the first to stand with us.</p>
        </div>

        <div class="signature">
            <p><strong>With respect,</strong><br>
            Most Valuable co.</p>
        </div>

        <div class="footer">
            <p>© 2025 Most Valuable. All rights reserved.</p>
            <p>You're receiving this email because you purchased entries for The Gold Rush Giveaway.</p>
        </div>
    </div>
</body>
</html>`;

    // Create text version for accessibility
    const emailText = `
Your entry has been confirmed for "The Gold Rush Giveaway" — a historical release of two one-of-one shirts, each backed by a quarter ounce of gold (7g).

You now officially hold a chance to secure what no one else in the world can claim: real luxury, built on lasting value.

ENTRY DETAILS:
• Entry ID: ${orderNumber}
• Entries Purchased: ${entry.count}
• Campaign Ends: ${endDateFormatted}
${entry.variantColor ? `• Shirt Color: ${entry.variantColor}` : ''}
${entry.size ? `• Shirt Size: ${entry.size}` : ''}

What happens next?:
1. Keep an eye on your inbox and Instagram — we'll update the community as the Gold Rush builds.
2. On ${endDateFormatted}, we will announce the two collectors chosen to receive the gold-backed shirts.
3. All other participants will receive their Digital Gold Brick Voucher ($250 off next release) as a token of appreciation for fueling this movement.

This isn't hype. This is history.
Thank you for being one of the first to stand with us.

With respect,
Most Valuable co.
`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'Most Valuable <noreply@mostvaluableco.com>',
      to: [entry.email],
      subject: `🏆 Gold Rush Entry Confirmed - ${entry.count} ${entry.count === 1 ? 'Entry' : 'Entries'} Secured`,
      html: emailHtml,
      text: emailText,
      headers: {
        'X-Entity-Ref-ID': entryId,
      },
    });

    console.log(`📧 Confirmation email sent via API to ${entry.email}:`, emailResponse);
    
    return NextResponse.json({
      success: true,
      emailId: emailResponse.data?.id || 'unknown',
      recipient: entry.email,
      entryCount: entry.count,
      method: 'api-route',
    });

  } catch (error: unknown) {
    console.error('Email API route error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Email API endpoint is active',
    supportedMethods: ['POST'],
    timestamp: new Date().toISOString()
  });
}
