create table "public"."batteries" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "enode_id" uuid,
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "can_export" boolean
);

alter table "public"."batteries" enable row level security;

create table "public"."meters" (
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null,
    "user_id" uuid not null
);

alter table "public"."meters" enable row level security;

create table "public"."user_metadata" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "is_onboarded" boolean default false
);

alter table "public"."user_metadata" enable row level security;

CREATE UNIQUE INDEX devices_pkey ON public.batteries USING btree (id);

CREATE UNIQUE INDEX devices_user_id_key ON public.batteries USING btree (user_id);

CREATE UNIQUE INDEX meters_pkey ON public.meters USING btree (id);

CREATE UNIQUE INDEX meters_user_id_key ON public.meters USING btree (user_id);

CREATE UNIQUE INDEX user_metadata_pkey ON public.user_metadata USING btree (id);

alter table "public"."batteries" add constraint "devices_pkey" PRIMARY KEY using index "devices_pkey";

alter table "public"."meters" add constraint "meters_pkey" PRIMARY KEY using index "meters_pkey";

alter table "public"."user_metadata" add constraint "user_metadata_pkey" PRIMARY KEY using index "user_metadata_pkey";

alter table "public"."batteries" add constraint "batteries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."batteries" validate constraint "batteries_user_id_fkey";

alter table "public"."batteries" add constraint "devices_user_id_key" UNIQUE using index "devices_user_id_key";

alter table "public"."meters" add constraint "meters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."meters" validate constraint "meters_user_id_fkey";

alter table "public"."meters" add constraint "meters_user_id_key" UNIQUE using index "meters_user_id_key";

alter table "public"."user_metadata" add constraint "user_metadata_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_metadata" validate constraint "user_metadata_id_fkey";

create policy "Allow users to read their own rows"
on "public"."batteries"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Authenticated users can read their own rows"
on "public"."meters"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

create policy "Users can create their own rows"
on "public"."user_metadata"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));

create policy "Users can edit their own rows"
on "public"."user_metadata"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));

create policy "Users can see their own rows"
on "public"."user_metadata"
as permissive
for select
to authenticated
using ((auth.uid() = id));