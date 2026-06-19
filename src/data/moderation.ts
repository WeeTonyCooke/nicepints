import { supabase } from '../supabaseClient';

export const REPORT_REASONS = [
  { value: 'inappropriate_photo', label: 'Inappropriate photo' },
  { value: 'spam', label: 'Spam or fake rating' },
  { value: 'wrong_pub', label: 'Wrong pub or misleading' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'other', label: 'Other' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

type SubmitReportInput = {
  pintId: string;
  reason: ReportReason;
  details?: string;
};

type SubmitPubRequestInput = {
  pubName: string;
  city: string;
  country: string;
  note?: string;
  contactEmail?: string;
};

export async function submitPintReport(input: SubmitReportInput): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Sign in to report a pint.');
  }

  const { error } = await supabase.from('pint_reports').insert({
    pint_id: input.pintId,
    reporter_id: session.user.id,
    reporter_email: session.user.email,
    reason: input.reason,
    details: input.details?.trim() || null,
    status: 'pending',
  });

  if (error) {
    if (error.message.includes('pint_reports') || error.code === '42P01') {
      throw new Error(
        'Reporting is not set up yet. Run the Phase 1 Supabase migration in supabase/migrations/.'
      );
    }
    throw new Error(`Could not submit report: ${error.message}`);
  }
}

export async function submitPubRequest(input: SubmitPubRequestInput): Promise<void> {
  const trimmedName = input.pubName.trim();
  const trimmedCity = input.city.trim();

  if (!trimmedName || !trimmedCity) {
    throw new Error('Pub name and city are required.');
  }

  const { data: { session } } = await supabase.auth.getSession();

  const { error } = await supabase.from('pub_requests').insert({
    user_id: session?.user?.id ?? null,
    user_email: session?.user?.email ?? (input.contactEmail?.trim() || null),
    pub_name: trimmedName,
    city: trimmedCity,
    country: input.country.trim() || 'Ireland',
    note: input.note?.trim() || null,
    status: 'pending',
  });

  if (error) {
    if (error.message.includes('pub_requests') || error.code === '42P01') {
      throw new Error(
        'Pub requests are not set up yet. Run the Phase 1 Supabase migration in supabase/migrations/.'
      );
    }
    throw new Error(`Could not submit request: ${error.message}`);
  }
}
