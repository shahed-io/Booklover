ALTER TABLE public.orders ADD COLUMN courier_name text, ADD COLUMN tracking_number text, ADD COLUMN tracking_url text, ADD COLUMN shipped_at timestamptz, ADD COLUMN shipment_status text NOT NULL DEFAULT 'not_shipped';
ALTER TABLE public.orders ADD CONSTRAINT orders_shipment_status_valid CHECK (shipment_status IN ('not_shipped','packed','shipped','delivered','returned'));
CREATE OR REPLACE FUNCTION public.validate_bookstore_shipment() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.shipment_status <> 'not_shipped' OR NEW.courier_name IS NOT NULL OR NEW.tracking_number IS NOT NULL OR NEW.tracking_url IS NOT NULL OR NEW.shipped_at IS NOT NULL THEN
      IF NOT public.has_role(auth.uid(), 'admin') AND NOT public._is_privileged_ctx() THEN RAISE EXCEPTION 'Only admins can manage shipments'; END IF;
    END IF;
  ELSE
    IF ROW(NEW.shipment_status,NEW.courier_name,NEW.tracking_number,NEW.tracking_url,NEW.shipped_at) IS DISTINCT FROM ROW(OLD.shipment_status,OLD.courier_name,OLD.tracking_number,OLD.tracking_url,OLD.shipped_at) THEN
      IF NOT public.has_role(auth.uid(), 'admin') AND NOT public._is_privileged_ctx() THEN RAISE EXCEPTION 'Only admins can manage shipments'; END IF;
    END IF;
  END IF;
  IF NEW.tracking_url IS NOT NULL AND NEW.tracking_url !~ '^https://[^[:space:]]+$' THEN RAISE EXCEPTION 'Tracking URL must use HTTPS'; END IF;
  IF NEW.shipment_status IN ('shipped','delivered') AND (COALESCE(trim(NEW.courier_name),'') = '' OR COALESCE(trim(NEW.tracking_number),'') = '') THEN RAISE EXCEPTION 'Courier and tracking number are required'; END IF;
  IF NEW.shipment_status IN ('shipped','delivered') AND NEW.shipped_at IS NULL THEN NEW.shipped_at := now(); END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_bookstore_shipment BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_bookstore_shipment();