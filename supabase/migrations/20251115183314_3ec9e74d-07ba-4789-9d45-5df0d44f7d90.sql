-- Fix function search path for update_updated_at function
-- This prevents potential SQL injection via search_path manipulation
-- Using CASCADE to handle dependent triggers

DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Recreate the triggers that were dropped
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_marketplace_freights_updated_at
  BEFORE UPDATE ON public.marketplace_freights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_freight_bids_updated_at
  BEFORE UPDATE ON public.freight_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();