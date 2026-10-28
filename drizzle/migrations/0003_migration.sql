DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
DROP TRIGGER IF EXISTS on_auth_user_updated_sync_oauth ON auth.users;
CREATE TRIGGER on_auth_user_updated_sync_oauth AFTER UPDATE OF raw_user_meta_data ON auth.users FOR EACH ROW EXECUTE FUNCTION public.sync_oauth_profile_data();
INSERT INTO public.profiles (user_id, display_name, email)
SELECT u.id, split_part(u.email,'@',1), u.email FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id=u.id)
ON CONFLICT (user_id) DO NOTHING;