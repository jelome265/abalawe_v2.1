# Security & Deployment Checklist

## Security Audit (Pre-Launch)
- [ ] **CSP Configured**: Verify `Content-Security-Policy` header blocks unauthorized scripts.
- [ ] **RLS Policies**: Audit all Supabase RLS policies. Ensure no `true` policies exist for sensitive tables.
- [ ] **Input Validation**: Verify Zod schemas cover all API inputs.
- [ ] **Rate Limiting**: Ensure rate limits are active on Auth and Webhook endpoints.
- [ ] **Secrets**: Verify no secrets are committed to git. Check `.env` files.
- [ ] **Dependency Audit**: Run `npm audit` and fix high-severity vulnerabilities.
- [ ] **Secure Cookies**: Ensure `httpOnly` and `secure` flags are set on auth cookies.

## Deployment Checklist
1. **Environment Variables**:
   - Configure all secrets in Vercel Project Settings.
   - Configure Supabase URL and Keys.
   - Configure Stripe Keys (Live mode).
2. **Database Migration**:
   - Run `supabase db push` or apply migrations to production DB.
   - Run seed script if necessary (for static data).
3. **Domain Configuration**:
   - Configure Custom Domain in Vercel.
   - Verify SSL certificate generation.
4. **Monitoring**:
   - Configure Sentry DSN (if used).
   - Check Vercel Analytics/Speed Insights.

## Rollback Procedures
### Code Rollback
1. Go to Vercel Dashboard > Deployments.
2. Find the last known good deployment.
3. Click "Redeploy" or "Promote to Production".

### Database Rollback
1. If a migration caused issues, use Supabase Dashboard to revert schema changes manually or run a down migration script if prepared.
2. **Emergency**: Restore database from daily backup via Supabase Dashboard.

## Emergency Revocation
- **Stripe**: Rotate Webhook Secret in Stripe Dashboard and update Vercel Env Vars.
- **Supabase**: Rotate Service Role Key in Supabase Dashboard if compromised.
- **Auth**: Revoke all user sessions via Supabase Auth > Users > Reset Password / Revoke.
