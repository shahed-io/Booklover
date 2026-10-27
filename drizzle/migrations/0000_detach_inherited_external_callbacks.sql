CREATE OR REPLACE FUNCTION public.email_queue_dispatch() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$ BEGIN RETURN; END; $function$;
COMMENT ON FUNCTION public.email_queue_dispatch() IS 'DEPRECATED: inherited email transport detached; reconfigure managed sending before enabling delivery.';
CREATE OR REPLACE FUNCTION public.email_queue_wake() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$ BEGIN RETURN NULL; END; $function$;
COMMENT ON FUNCTION public.email_queue_wake() IS 'DEPRECATED: source-project email callback detached; queue remains available.';
CREATE OR REPLACE FUNCTION public.notify_abandoned_checkout_telegram() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN NEW; END; $function$;
CREATE OR REPLACE FUNCTION public.notify_new_order_telegram() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN NEW; END; $function$;
CREATE OR REPLACE FUNCTION public.notify_order_status_change_telegram() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN NEW; END; $function$;
COMMENT ON FUNCTION public.notify_abandoned_checkout_telegram() IS 'DEPRECATED: inherited external notification destination detached; order writes preserved.';
COMMENT ON FUNCTION public.notify_new_order_telegram() IS 'DEPRECATED: inherited external notification destination detached; order writes preserved.';
COMMENT ON FUNCTION public.notify_order_status_change_telegram() IS 'DEPRECATED: inherited external notification destination detached; order writes preserved.';
CREATE OR REPLACE FUNCTION public.notify_offer_winner() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$
DECLARE v_offer RECORD; v_submission RECORD;
BEGIN
 SELECT * INTO v_offer FROM public.offers WHERE id=NEW.offer_id;
 IF NOT FOUND OR NOT COALESCE(v_offer.auto_notify_winners,false) THEN RETURN NEW; END IF;
 SELECT * INTO v_submission FROM public.offer_submissions WHERE id=NEW.submission_id;
 IF v_submission.user_id IS NOT NULL THEN
 INSERT INTO public.notifications(user_id,title,message,type,is_read) VALUES(v_submission.user_id,'🎉 অভিনন্দন! আপনি বিজয়ী হয়েছেন','Giveaway "'||v_offer.title||'" এ আপনি '||NEW.rank||' নম্বর বিজয়ী হয়েছেন। পুরস্কার: '||COALESCE(NEW.prize,'শীঘ্রই ঘোষণা করা হবে'),'promo',false);
 END IF;
 RETURN NEW;
END; $function$;
COMMENT ON FUNCTION public.notify_offer_winner() IS 'Retains in-app winner notifications; inherited external email transport removed.';
CREATE OR REPLACE FUNCTION public.notify_seo_ping_blog() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN NEW; END; $function$;
CREATE OR REPLACE FUNCTION public.notify_seo_ping_product() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN NEW; END; $function$;
CREATE OR REPLACE FUNCTION public.ping_sitemap_on_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$ BEGIN RETURN COALESCE(NEW,OLD); END; $function$;
COMMENT ON FUNCTION public.notify_seo_ping_blog() IS 'DEPRECATED: inherited external indexing callback detached; dynamic sitemap remains supported.';
COMMENT ON FUNCTION public.notify_seo_ping_product() IS 'DEPRECATED: inherited external indexing callback detached; dynamic sitemap remains supported.';
COMMENT ON FUNCTION public.ping_sitemap_on_change() IS 'DEPRECATED: obsolete Google sitemap ping transport removed; dynamic sitemap remains supported.';