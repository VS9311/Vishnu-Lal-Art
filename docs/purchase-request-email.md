# Purchase request email setup

The cart submits to `/api/purchase-request`, a Cloudflare Pages Function. It sends only to `studio@vishnulalartist.com`. Browser code never receives the email API key. Prices and publication status are checked against the published Sanity catalogue before sending. This does not take payment or reserve artwork.

## Activation

1. Sign in to Resend and add a sending domain or subdomain belonging to the Studio. Review its exact verification records with the domain owner before changing DNS. Do not change existing mailbox MX records.
2. Once verified, create a sending-only API key restricted to that domain.
3. In the existing Cloudflare Pages project's environment settings, store `RESEND_API_KEY` as a secret and `PURCHASE_FROM_EMAIL` as a verified sender, for example `Vishnu Lal Studio <requests@notifications.vishnulalartist.com>` only if that subdomain has been verified. Do not use a collector's address as the sender.
4. Optional server configuration: `SANITY_PROJECT_ID` defaults to `2gtua40d`; `SANITY_DATASET` defaults to `staging`, matching the current website.
5. Redeploy a preview with these settings. Send an explicitly approved test request, confirm receipt in the Studio inbox and inspect the Resend delivery status before production activation. Check spam controls and configure an appropriate Cloudflare rate limit for POST `/api/purchase-request` before exposing it publicly.

## Local development

Plain Vite serves the frontend only. Its checkout deliberately reports that the request was not sent when the API isn't available. Test actual delivery with Cloudflare Pages local development or an authorised preview. Never enter real customer details into automated tests.

## Behaviour

- Required: name, country, delivery address, policy acknowledgement.
- At least one of email or phone. If email is supplied, it must be valid.
- Notes are optional.
- Missing configuration, catalogue failures and email-provider errors do not show a success screen.
- Requests have an idempotency identifier so retrying the same submission does not send duplicate emails.
- A successful response means the email service accepted the message. Delivery to the inbox must be verified during activation.
