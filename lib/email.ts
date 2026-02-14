import { SendVerificationRequestParams } from 'next-auth/providers/email';
import type { Theme } from 'next-auth/core/types';
import { createTransport } from 'nodemailer';
import { jwt } from '@/lib/jwt';

export async function sendVerificationRequest({
  identifier, url, provider, theme
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  const token = jwt.sign(
    { kind: 'unsubscribe' },
    process.env.NEXTAUTH_SECRET ?? '',
    {
      algorithm: 'HS256',
      subject: identifier
    }
  );
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_USER_ID) {
    const [localPart, domainPart, other] = identifier.split('@');
    const masked =
      (!domainPart || other)
        ? '***'
        : `${localPart.length <= 1 ? localPart : `${localPart[0]}***${localPart[localPart.length - 1]}`}@${domainPart}`;
    try {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_USER_ID, text: `Sign-in link sent to ${masked}` }),
      });
    } catch (error) {
      console.error('Telegram notify failed:', error);
    }
  }
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host, token }),
    html: html({ url, host, token, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

interface TextParams {
  url: string;
  host: string;
  token: string;
}

interface HtmlParams extends TextParams {
  theme: Theme;
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do,
 * remember to sanitize it!
 */
function html({ url, host, token, theme }: HtmlParams) {
  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = theme.brandColor || "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px;">
        <a
          style="margin: 0 5px; font-size: 14px; line-height: 20px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};"
          href="${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${host}/unsubscribe/${token}"
        >Unsubscribe</a>
        <a
          style="margin: 0 5px; font-size: 14px; line-height: 20px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};"
          href="mailto:support@ln2.email"
        >Support</a>
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host, token }: TextParams) {
  return [
    `Sign in to ${host}\n${url}\n\n`,
    `Unsubscribe:\n${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${host}/unsubscribe/${token}\n\n`,
    `Support Email:\nsupport@ln2.email`
  ].join('');
}
