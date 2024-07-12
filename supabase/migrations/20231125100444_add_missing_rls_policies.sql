create policy "Users can insert their own rows"
on "public"."batteries"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can update their own rows"
on "public"."batteries"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can insert their own rows"
on "public"."meters"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can update their own rows"
on "public"."meters"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



