--
-- PostgreSQL database dump
--

\restrict pyZLHYS1bV0p66qcFsLVMn3d7TcNHUpt14dPzbhvXAjPStEL5cJ6OC9WTov6hAa

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS "pgrst_drop_watch";
DROP EVENT TRIGGER IF EXISTS "pgrst_ddl_watch";
DROP EVENT TRIGGER IF EXISTS "issue_pg_net_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_graphql_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_cron_access";
DROP EVENT TRIGGER IF EXISTS "issue_graphql_placeholder";
DROP PUBLICATION IF EXISTS "supabase_realtime";
DROP POLICY IF EXISTS "public read course-videos" ON "storage"."objects";
DROP POLICY IF EXISTS "public read course-assets" ON "storage"."objects";
DROP POLICY IF EXISTS "admins upload course-videos" ON "storage"."objects";
DROP POLICY IF EXISTS "admins upload course-assets" ON "storage"."objects";
DROP POLICY IF EXISTS "admins update course-videos" ON "storage"."objects";
DROP POLICY IF EXISTS "admins update course-assets" ON "storage"."objects";
DROP POLICY IF EXISTS "admins delete course-videos" ON "storage"."objects";
DROP POLICY IF EXISTS "admins delete course-assets" ON "storage"."objects";
DROP POLICY IF EXISTS "public read topics" ON "public"."topics";
DROP POLICY IF EXISTS "public read subtopics" ON "public"."subtopics";
DROP POLICY IF EXISTS "public read skills" ON "public"."skills";
DROP POLICY IF EXISTS "public read quizzes" ON "public"."quizzes";
DROP POLICY IF EXISTS "public read glossary_terms" ON "public"."glossary_terms";
DROP POLICY IF EXISTS "public read courses" ON "public"."courses";
DROP POLICY IF EXISTS "employees manage own skill progress" ON "public"."employee_skill_progress";
DROP POLICY IF EXISTS "employees manage own quiz_attempts" ON "public"."quiz_attempts";
DROP POLICY IF EXISTS "employees manage own lesson_progress" ON "public"."lesson_progress";
DROP POLICY IF EXISTS "employees manage own enrollments" ON "public"."enrollments";
DROP POLICY IF EXISTS "employees can view own profile" ON "public"."employees";
DROP POLICY IF EXISTS "employees can update own profile" ON "public"."employees";
DROP POLICY IF EXISTS "admins write topics" ON "public"."topics";
DROP POLICY IF EXISTS "admins write subtopics" ON "public"."subtopics";
DROP POLICY IF EXISTS "admins write skills" ON "public"."skills";
DROP POLICY IF EXISTS "admins write quizzes" ON "public"."quizzes";
DROP POLICY IF EXISTS "admins write glossary_terms" ON "public"."glossary_terms";
DROP POLICY IF EXISTS "admins write courses" ON "public"."courses";
DROP POLICY IF EXISTS "admins update topics" ON "public"."topics";
DROP POLICY IF EXISTS "admins update subtopics" ON "public"."subtopics";
DROP POLICY IF EXISTS "admins update skills" ON "public"."skills";
DROP POLICY IF EXISTS "admins update quizzes" ON "public"."quizzes";
DROP POLICY IF EXISTS "admins update glossary_terms" ON "public"."glossary_terms";
DROP POLICY IF EXISTS "admins update courses" ON "public"."courses";
DROP POLICY IF EXISTS "admins delete topics" ON "public"."topics";
DROP POLICY IF EXISTS "admins delete subtopics" ON "public"."subtopics";
DROP POLICY IF EXISTS "admins delete skills" ON "public"."skills";
DROP POLICY IF EXISTS "admins delete quizzes" ON "public"."quizzes";
DROP POLICY IF EXISTS "admins delete glossary_terms" ON "public"."glossary_terms";
DROP POLICY IF EXISTS "admins delete courses" ON "public"."courses";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_upload_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."topics" DROP CONSTRAINT IF EXISTS "topics_prerequisite_topic_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."topics" DROP CONSTRAINT IF EXISTS "topics_course_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."subtopics" DROP CONSTRAINT IF EXISTS "subtopics_topic_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."quizzes" DROP CONSTRAINT IF EXISTS "quizzes_subtopic_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."quiz_attempts" DROP CONSTRAINT IF EXISTS "quiz_attempts_employee_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_progress" DROP CONSTRAINT IF EXISTS "lesson_progress_employee_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."enrollments" DROP CONSTRAINT IF EXISTS "enrollments_employee_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."employees" DROP CONSTRAINT IF EXISTS "employees_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."employee_skill_progress" DROP CONSTRAINT IF EXISTS "employee_skill_progress_skill_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."employee_skill_progress" DROP CONSTRAINT IF EXISTS "employee_skill_progress_employee_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."webauthn_credentials" DROP CONSTRAINT IF EXISTS "webauthn_credentials_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."webauthn_challenges" DROP CONSTRAINT IF EXISTS "webauthn_challenges_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_oauth_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_flow_state_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_auth_factor_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_user_id_fkey";
DROP TRIGGER IF EXISTS "update_objects_updated_at" ON "storage"."objects";
DROP TRIGGER IF EXISTS "protect_objects_delete" ON "storage"."objects";
DROP TRIGGER IF EXISTS "protect_buckets_delete" ON "storage"."buckets";
DROP TRIGGER IF EXISTS "enforce_bucket_name_length_trigger" ON "storage"."buckets";
DROP TRIGGER IF EXISTS "tr_check_filters" ON "realtime"."subscription";
DROP TRIGGER IF EXISTS "trg_topics_updated_at" ON "public"."topics";
DROP TRIGGER IF EXISTS "trg_subtopics_updated_at" ON "public"."subtopics";
DROP TRIGGER IF EXISTS "trg_quizzes_updated_at" ON "public"."quizzes";
DROP TRIGGER IF EXISTS "trg_courses_updated_at" ON "public"."courses";
DROP TRIGGER IF EXISTS "quiz_attempts_enforce_lockout" ON "public"."quiz_attempts";
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
DROP INDEX IF EXISTS "storage"."vector_indexes_name_bucket_id_idx";
DROP INDEX IF EXISTS "storage"."name_prefix_search";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name_lower";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name";
DROP INDEX IF EXISTS "storage"."idx_multipart_uploads_list";
DROP INDEX IF EXISTS "storage"."buckets_analytics_unique_name_idx";
DROP INDEX IF EXISTS "storage"."bucketid_objname";
DROP INDEX IF EXISTS "storage"."bname";
DROP INDEX IF EXISTS "realtime"."subscription_subscription_id_entity_filters_action_filter_selec";
DROP INDEX IF EXISTS "realtime"."messages_inserted_at_topic_index";
DROP INDEX IF EXISTS "realtime"."ix_realtime_subscription_entity";
DROP INDEX IF EXISTS "public"."idx_topics_sequence";
DROP INDEX IF EXISTS "public"."idx_topics_course_id";
DROP INDEX IF EXISTS "public"."idx_subtopics_topic_id";
DROP INDEX IF EXISTS "public"."idx_subtopics_sequence";
DROP INDEX IF EXISTS "public"."idx_quizzes_subtopic_id";
DROP INDEX IF EXISTS "public"."idx_quiz_attempts_employee";
DROP INDEX IF EXISTS "public"."idx_lesson_progress_employee";
DROP INDEX IF EXISTS "public"."idx_enrollments_employee";
DROP INDEX IF EXISTS "public"."idx_courses_sequence";
DROP INDEX IF EXISTS "auth"."webauthn_credentials_user_id_idx";
DROP INDEX IF EXISTS "auth"."webauthn_credentials_credential_id_key";
DROP INDEX IF EXISTS "auth"."webauthn_challenges_user_id_idx";
DROP INDEX IF EXISTS "auth"."webauthn_challenges_expires_at_idx";
DROP INDEX IF EXISTS "auth"."users_is_anonymous_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_email_idx";
DROP INDEX IF EXISTS "auth"."users_email_partial_key";
DROP INDEX IF EXISTS "auth"."user_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."unique_phone_factor_per_user";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_pattern_idx";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_domain_idx";
DROP INDEX IF EXISTS "auth"."sessions_user_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_oauth_client_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_not_after_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_for_email_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_created_at_idx";
DROP INDEX IF EXISTS "auth"."saml_providers_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_updated_at_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_session_id_revoked_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_parent_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_user_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_idx";
DROP INDEX IF EXISTS "auth"."recovery_token_idx";
DROP INDEX IF EXISTS "auth"."reauthentication_token_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_user_id_token_type_key";
DROP INDEX IF EXISTS "auth"."one_time_tokens_token_hash_hash_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_relates_to_hash_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_user_order_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_user_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_clients_deleted_at_idx";
DROP INDEX IF EXISTS "auth"."oauth_auth_pending_exp_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_id_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_friendly_name_unique";
DROP INDEX IF EXISTS "auth"."mfa_challenge_created_at_idx";
DROP INDEX IF EXISTS "auth"."idx_users_name";
DROP INDEX IF EXISTS "auth"."idx_users_last_sign_in_at_desc";
DROP INDEX IF EXISTS "auth"."idx_users_email";
DROP INDEX IF EXISTS "auth"."idx_users_created_at_desc";
DROP INDEX IF EXISTS "auth"."idx_user_id_auth_method";
DROP INDEX IF EXISTS "auth"."idx_oauth_client_states_created_at";
DROP INDEX IF EXISTS "auth"."idx_auth_code";
DROP INDEX IF EXISTS "auth"."identities_user_id_idx";
DROP INDEX IF EXISTS "auth"."identities_email_idx";
DROP INDEX IF EXISTS "auth"."flow_state_created_at_idx";
DROP INDEX IF EXISTS "auth"."factor_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_new_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_current_idx";
DROP INDEX IF EXISTS "auth"."custom_oauth_providers_provider_type_idx";
DROP INDEX IF EXISTS "auth"."custom_oauth_providers_identifier_idx";
DROP INDEX IF EXISTS "auth"."custom_oauth_providers_enabled_idx";
DROP INDEX IF EXISTS "auth"."custom_oauth_providers_created_at_idx";
DROP INDEX IF EXISTS "auth"."confirmation_token_idx";
DROP INDEX IF EXISTS "auth"."audit_logs_instance_id_idx";
ALTER TABLE IF EXISTS ONLY "supabase_migrations"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "supabase_migrations"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_idempotency_key_key";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_name_key";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_vectors" DROP CONSTRAINT IF EXISTS "buckets_vectors_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_analytics" DROP CONSTRAINT IF EXISTS "buckets_analytics_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."subscription" DROP CONSTRAINT IF EXISTS "pk_subscription";
ALTER TABLE IF EXISTS ONLY "realtime"."messages" DROP CONSTRAINT IF EXISTS "messages_pkey";
ALTER TABLE IF EXISTS "realtime"."messages" DROP CONSTRAINT IF EXISTS "messages_payload_exclusive";
ALTER TABLE IF EXISTS ONLY "public"."topics" DROP CONSTRAINT IF EXISTS "topics_pkey";
ALTER TABLE IF EXISTS ONLY "public"."topics" DROP CONSTRAINT IF EXISTS "topics_course_id_slug_key";
ALTER TABLE IF EXISTS ONLY "public"."subtopics" DROP CONSTRAINT IF EXISTS "subtopics_pkey";
ALTER TABLE IF EXISTS ONLY "public"."skills" DROP CONSTRAINT IF EXISTS "skills_slug_key";
ALTER TABLE IF EXISTS ONLY "public"."skills" DROP CONSTRAINT IF EXISTS "skills_pkey";
ALTER TABLE IF EXISTS ONLY "public"."quizzes" DROP CONSTRAINT IF EXISTS "quizzes_subtopic_id_key";
ALTER TABLE IF EXISTS ONLY "public"."quizzes" DROP CONSTRAINT IF EXISTS "quizzes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."quiz_attempts" DROP CONSTRAINT IF EXISTS "quiz_attempts_pkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_progress" DROP CONSTRAINT IF EXISTS "lesson_progress_pkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_progress" DROP CONSTRAINT IF EXISTS "lesson_progress_employee_id_module_slug_lesson_id_key";
ALTER TABLE IF EXISTS ONLY "public"."glossary_terms" DROP CONSTRAINT IF EXISTS "glossary_terms_slug_key";
ALTER TABLE IF EXISTS ONLY "public"."glossary_terms" DROP CONSTRAINT IF EXISTS "glossary_terms_pkey";
ALTER TABLE IF EXISTS ONLY "public"."enrollments" DROP CONSTRAINT IF EXISTS "enrollments_pkey";
ALTER TABLE IF EXISTS ONLY "public"."enrollments" DROP CONSTRAINT IF EXISTS "enrollments_employee_id_module_slug_key";
ALTER TABLE IF EXISTS ONLY "public"."employees" DROP CONSTRAINT IF EXISTS "employees_pkey";
ALTER TABLE IF EXISTS ONLY "public"."employees" DROP CONSTRAINT IF EXISTS "employees_email_key";
ALTER TABLE IF EXISTS ONLY "public"."employee_skill_progress" DROP CONSTRAINT IF EXISTS "employee_skill_progress_pkey";
ALTER TABLE IF EXISTS ONLY "public"."employee_skill_progress" DROP CONSTRAINT IF EXISTS "employee_skill_progress_employee_id_skill_id_key";
ALTER TABLE IF EXISTS ONLY "public"."courses" DROP CONSTRAINT IF EXISTS "courses_slug_key";
ALTER TABLE IF EXISTS ONLY "public"."courses" DROP CONSTRAINT IF EXISTS "courses_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."webauthn_credentials" DROP CONSTRAINT IF EXISTS "webauthn_credentials_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."webauthn_challenges" DROP CONSTRAINT IF EXISTS "webauthn_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_phone_key";
ALTER TABLE IF EXISTS ONLY "auth"."sso_providers" DROP CONSTRAINT IF EXISTS "sso_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_entity_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_token_unique";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_client_unique";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_clients" DROP CONSTRAINT IF EXISTS "oauth_clients_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_client_states" DROP CONSTRAINT IF EXISTS "oauth_client_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_code_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_last_challenged_at_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_authentication_method_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."instances" DROP CONSTRAINT IF EXISTS "instances_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_provider_id_provider_unique";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."flow_state" DROP CONSTRAINT IF EXISTS "flow_state_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."custom_oauth_providers" DROP CONSTRAINT IF EXISTS "custom_oauth_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."custom_oauth_providers" DROP CONSTRAINT IF EXISTS "custom_oauth_providers_identifier_key";
ALTER TABLE IF EXISTS ONLY "auth"."audit_log_entries" DROP CONSTRAINT IF EXISTS "audit_log_entries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "amr_id_pk";
ALTER TABLE IF EXISTS "auth"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "supabase_migrations"."schema_migrations";
DROP TABLE IF EXISTS "storage"."vector_indexes";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads_parts";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads";
DROP TABLE IF EXISTS "storage"."objects";
DROP TABLE IF EXISTS "storage"."migrations";
DROP TABLE IF EXISTS "storage"."buckets_vectors";
DROP TABLE IF EXISTS "storage"."buckets_analytics";
DROP TABLE IF EXISTS "storage"."buckets";
DROP TABLE IF EXISTS "realtime"."subscription";
DROP TABLE IF EXISTS "realtime"."schema_migrations";
DROP TABLE IF EXISTS "realtime"."messages";
DROP TABLE IF EXISTS "public"."topics";
DROP TABLE IF EXISTS "public"."subtopics";
DROP TABLE IF EXISTS "public"."skills";
DROP TABLE IF EXISTS "public"."quizzes";
DROP VIEW IF EXISTS "public"."module_certifications";
DROP TABLE IF EXISTS "public"."quiz_attempts";
DROP TABLE IF EXISTS "public"."lesson_progress";
DROP TABLE IF EXISTS "public"."glossary_terms";
DROP TABLE IF EXISTS "public"."enrollments";
DROP TABLE IF EXISTS "public"."employees";
DROP TABLE IF EXISTS "public"."employee_skill_progress";
DROP TABLE IF EXISTS "public"."courses";
DROP TABLE IF EXISTS "auth"."webauthn_credentials";
DROP TABLE IF EXISTS "auth"."webauthn_challenges";
DROP TABLE IF EXISTS "auth"."users";
DROP TABLE IF EXISTS "auth"."sso_providers";
DROP TABLE IF EXISTS "auth"."sso_domains";
DROP TABLE IF EXISTS "auth"."sessions";
DROP TABLE IF EXISTS "auth"."schema_migrations";
DROP TABLE IF EXISTS "auth"."saml_relay_states";
DROP TABLE IF EXISTS "auth"."saml_providers";
DROP SEQUENCE IF EXISTS "auth"."refresh_tokens_id_seq";
DROP TABLE IF EXISTS "auth"."refresh_tokens";
DROP TABLE IF EXISTS "auth"."one_time_tokens";
DROP TABLE IF EXISTS "auth"."oauth_consents";
DROP TABLE IF EXISTS "auth"."oauth_clients";
DROP TABLE IF EXISTS "auth"."oauth_client_states";
DROP TABLE IF EXISTS "auth"."oauth_authorizations";
DROP TABLE IF EXISTS "auth"."mfa_factors";
DROP TABLE IF EXISTS "auth"."mfa_challenges";
DROP TABLE IF EXISTS "auth"."mfa_amr_claims";
DROP TABLE IF EXISTS "auth"."instances";
DROP TABLE IF EXISTS "auth"."identities";
DROP TABLE IF EXISTS "auth"."flow_state";
DROP TABLE IF EXISTS "auth"."custom_oauth_providers";
DROP TABLE IF EXISTS "auth"."audit_log_entries";
DROP FUNCTION IF EXISTS "storage"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text");
DROP FUNCTION IF EXISTS "storage"."search_by_timestamp"("p_prefix" "text", "p_bucket_id" "text", "p_limit" integer, "p_level" integer, "p_start_after" "text", "p_sort_order" "text", "p_sort_column" "text", "p_sort_column_after" "text");
DROP FUNCTION IF EXISTS "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."protect_delete"();
DROP FUNCTION IF EXISTS "storage"."operation"();
DROP FUNCTION IF EXISTS "storage"."list_objects_with_delimiter"("_bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text", "sort_order" "text");
DROP FUNCTION IF EXISTS "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text");
DROP FUNCTION IF EXISTS "storage"."get_size_by_bucket"();
DROP FUNCTION IF EXISTS "storage"."get_common_prefix"("p_key" "text", "p_prefix" "text", "p_delimiter" "text");
DROP FUNCTION IF EXISTS "storage"."foldername"("name" "text");
DROP FUNCTION IF EXISTS "storage"."filename"("name" "text");
DROP FUNCTION IF EXISTS "storage"."extension"("name" "text");
DROP FUNCTION IF EXISTS "storage"."enforce_bucket_name_length"();
DROP FUNCTION IF EXISTS "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb");
DROP FUNCTION IF EXISTS "storage"."allow_only_operation"("expected_operation" "text");
DROP FUNCTION IF EXISTS "storage"."allow_any_operation"("expected_operations" "text"[]);
DROP FUNCTION IF EXISTS "realtime"."wal2json_escape_identifier"("name" "text");
DROP FUNCTION IF EXISTS "realtime"."topic"();
DROP FUNCTION IF EXISTS "realtime"."to_regrole"("role_name" "text");
DROP FUNCTION IF EXISTS "realtime"."subscription_check_filters"();
DROP FUNCTION IF EXISTS "realtime"."send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean);
DROP FUNCTION IF EXISTS "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean);
DROP FUNCTION IF EXISTS "realtime"."quote_wal2json"("entity" "regclass");
DROP FUNCTION IF EXISTS "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]);
DROP FUNCTION IF EXISTS "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean);
DROP FUNCTION IF EXISTS "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text");
DROP FUNCTION IF EXISTS "realtime"."cast"("val" "text", "type_" "regtype");
DROP FUNCTION IF EXISTS "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]);
DROP FUNCTION IF EXISTS "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text");
DROP FUNCTION IF EXISTS "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "public"."set_updated_at"();
DROP FUNCTION IF EXISTS "public"."quiz_lockout_status"("p_employee_id" "uuid", "p_module_slug" "text");
DROP FUNCTION IF EXISTS "public"."my_quiz_lockout_status"("p_module_slug" "text");
DROP FUNCTION IF EXISTS "public"."is_admin"("uid" "uuid");
DROP FUNCTION IF EXISTS "public"."handle_new_user"();
DROP FUNCTION IF EXISTS "public"."enforce_quiz_lockout"();
DROP FUNCTION IF EXISTS "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb");
DROP FUNCTION IF EXISTS "public"."admin_bulk_import_courses"("payload" "jsonb");
DROP FUNCTION IF EXISTS "public"."admin_bulk_import_course"("payload" "jsonb");
DROP FUNCTION IF EXISTS "pgbouncer"."get_auth"("p_usename" "text");
DROP FUNCTION IF EXISTS "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb");
DROP FUNCTION IF EXISTS "extensions"."set_graphql_placeholder"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_drop_watch"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_ddl_watch"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_net_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_graphql_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_cron_access"();
DROP FUNCTION IF EXISTS "auth"."uid"();
DROP FUNCTION IF EXISTS "auth"."role"();
DROP FUNCTION IF EXISTS "auth"."jwt"();
DROP FUNCTION IF EXISTS "auth"."email"();
DROP TYPE IF EXISTS "storage"."buckettype";
DROP TYPE IF EXISTS "realtime"."wal_rls";
DROP TYPE IF EXISTS "realtime"."wal_column";
DROP TYPE IF EXISTS "realtime"."user_defined_filter";
DROP TYPE IF EXISTS "realtime"."equality_op";
DROP TYPE IF EXISTS "realtime"."action";
DROP TYPE IF EXISTS "auth"."one_time_token_type";
DROP TYPE IF EXISTS "auth"."oauth_response_type";
DROP TYPE IF EXISTS "auth"."oauth_registration_type";
DROP TYPE IF EXISTS "auth"."oauth_client_type";
DROP TYPE IF EXISTS "auth"."oauth_authorization_status";
DROP TYPE IF EXISTS "auth"."factor_type";
DROP TYPE IF EXISTS "auth"."factor_status";
DROP TYPE IF EXISTS "auth"."code_challenge_method";
DROP TYPE IF EXISTS "auth"."aal_level";
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "supabase_vault";
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "pg_stat_statements";
DROP SCHEMA IF EXISTS "vault";
DROP SCHEMA IF EXISTS "supabase_migrations";
DROP SCHEMA IF EXISTS "storage";
DROP SCHEMA IF EXISTS "realtime";
DROP SCHEMA IF EXISTS "pgbouncer";
DROP SCHEMA IF EXISTS "graphql_public";
DROP SCHEMA IF EXISTS "graphql";
DROP SCHEMA IF EXISTS "extensions";
DROP SCHEMA IF EXISTS "auth";
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "auth";


ALTER SCHEMA "auth" OWNER TO "supabase_admin";

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "extensions";


ALTER SCHEMA "extensions" OWNER TO "postgres";

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "graphql";


ALTER SCHEMA "graphql" OWNER TO "supabase_admin";

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "graphql_public";


ALTER SCHEMA "graphql_public" OWNER TO "supabase_admin";

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA "pgbouncer";


ALTER SCHEMA "pgbouncer" OWNER TO "pgbouncer";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "realtime";


ALTER SCHEMA "realtime" OWNER TO "supabase_admin";

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "storage";


ALTER SCHEMA "storage" OWNER TO "supabase_admin";

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "supabase_migrations";


ALTER SCHEMA "supabase_migrations" OWNER TO "postgres";

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA "vault";


ALTER SCHEMA "vault" OWNER TO "supabase_admin";

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE "auth"."aal_level" OWNER TO "supabase_auth_admin";

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


ALTER TYPE "auth"."code_challenge_method" OWNER TO "supabase_auth_admin";

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE "auth"."factor_status" OWNER TO "supabase_auth_admin";

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE "auth"."factor_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE "auth"."oauth_authorization_status" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE "auth"."oauth_client_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE "auth"."oauth_registration_type" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


ALTER TYPE "auth"."oauth_response_type" OWNER TO "supabase_auth_admin";

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE "auth"."one_time_token_type" OWNER TO "supabase_auth_admin";

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE "realtime"."action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE "realtime"."action" OWNER TO "supabase_realtime_admin";

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE "realtime"."equality_op" AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE "realtime"."equality_op" OWNER TO "supabase_realtime_admin";

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text",
	"negate" boolean
);


ALTER TYPE "realtime"."user_defined_filter" OWNER TO "supabase_realtime_admin";

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE "realtime"."wal_column" AS (
	"name" "text",
	"type_name" "text",
	"type_oid" "oid",
	"value" "jsonb",
	"is_pkey" boolean,
	"is_selectable" boolean
);


ALTER TYPE "realtime"."wal_column" OWNER TO "supabase_realtime_admin";

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE "realtime"."wal_rls" AS (
	"wal" "jsonb",
	"is_rls_enabled" boolean,
	"subscription_ids" "uuid"[],
	"errors" "text"[]
);


ALTER TYPE "realtime"."wal_rls" OWNER TO "supabase_realtime_admin";

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE "storage"."buckettype" OWNER TO "supabase_storage_admin";

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION "auth"."email"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION "auth"."jwt"() OWNER TO "supabase_auth_admin";

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION "auth"."role"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_auth_admin";

--
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."grant_pg_cron_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION "extensions"."grant_pg_cron_access"() OWNER TO "supabase_admin";

--
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."grant_pg_graphql_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION "extensions"."grant_pg_graphql_access"() OWNER TO "supabase_admin";

--
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."grant_pg_net_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION "extensions"."grant_pg_net_access"() OWNER TO "supabase_admin";

--
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."pgrst_ddl_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION "extensions"."pgrst_ddl_watch"() OWNER TO "supabase_admin";

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."pgrst_drop_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION "extensions"."pgrst_drop_watch"() OWNER TO "supabase_admin";

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION "extensions"."set_graphql_placeholder"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION "extensions"."set_graphql_placeholder"() OWNER TO "supabase_admin";

--
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql("text", "text", "jsonb", "jsonb"); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION "graphql_public"."graphql"("operationName" "text" DEFAULT NULL::"text", "query" "text" DEFAULT NULL::"text", "variables" "jsonb" DEFAULT NULL::"jsonb", "extensions" "jsonb" DEFAULT NULL::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") OWNER TO "supabase_admin";

--
-- Name: get_auth("text"); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION "pgbouncer"."get_auth"("p_usename" "text") RETURNS TABLE("username" "text", "password" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION "pgbouncer"."get_auth"("p_usename" "text") OWNER TO "supabase_admin";

--
-- Name: admin_bulk_import_course("jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."admin_bulk_import_course"("payload" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_course_id uuid;
  v_topic_id uuid;
  v_subtopic_id uuid;
  v_topic jsonb;
  v_subtopic jsonb;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';
  END IF;

  IF payload->'course' IS NULL THEN
    RAISE EXCEPTION 'payload.course is required';
  END IF;

  INSERT INTO public.courses (title, slug, description, image_url, sequence_order)
  VALUES (
    payload->'course'->>'title',
    payload->'course'->>'slug',
    payload->'course'->>'description',
    payload->'course'->>'image_url',
    COALESCE((payload->'course'->>'sequence_order')::integer, 0)
  )
  RETURNING id INTO v_course_id;

  FOR v_topic IN SELECT * FROM jsonb_array_elements(COALESCE(payload->'topics', '[]'::jsonb))
  LOOP
    INSERT INTO public.topics (course_id, title, slug, sequence_order)
    VALUES (
      v_course_id,
      v_topic->>'title',
      v_topic->>'slug',
      COALESCE((v_topic->>'sequence_order')::integer, 0)
    )
    RETURNING id INTO v_topic_id;

    FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))
    LOOP
      INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)
      VALUES (
        v_topic_id,
        v_subtopic->>'title',
        COALESCE((v_subtopic->>'sequence_order')::integer, 0),
        COALESCE(v_subtopic->'content_json', '[]'::jsonb)
      )
      RETURNING id INTO v_subtopic_id;

      IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN
        INSERT INTO public.quizzes (subtopic_id, questions_json)
        VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');
      END IF;
    END LOOP;
  END LOOP;

  RETURN v_course_id;
END;
$$;


ALTER FUNCTION "public"."admin_bulk_import_course"("payload" "jsonb") OWNER TO "postgres";

--
-- Name: admin_bulk_import_courses("jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."admin_bulk_import_courses"("payload" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_courses jsonb := coalesce(payload->'courses', '[]'::jsonb);
  v_course_item jsonb;
  v_imported jsonb := '[]'::jsonb;
  v_errors jsonb := '[]'::jsonb;
  v_course_id uuid;
  v_topic_id uuid;
  v_subtopic_id uuid;
  v_topic jsonb;
  v_subtopic jsonb;
  v_title text;
  v_existing_slug text;
  v_next_topic_order integer;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';
  END IF;

  IF jsonb_typeof(v_courses) <> 'array' OR jsonb_array_length(v_courses) = 0 THEN
    RAISE EXCEPTION 'payload.courses must be a non-empty array';
  END IF;

  FOR v_course_item IN SELECT * FROM jsonb_array_elements(v_courses)
  LOOP
    v_existing_slug := v_course_item->>'existing_course_slug';
    v_title := COALESCE(v_course_item->'course'->>'title', v_existing_slug);

    BEGIN
      IF v_existing_slug IS NOT NULL THEN
        SELECT id INTO v_course_id FROM public.courses WHERE slug = v_existing_slug;
        IF v_course_id IS NULL THEN
          RAISE EXCEPTION 'No existing course found with slug "%"', v_existing_slug;
        END IF;
        SELECT COALESCE(MAX(sequence_order), -1) + 1 INTO v_next_topic_order
          FROM public.topics WHERE course_id = v_course_id;
      ELSE
        INSERT INTO public.courses (title, slug, description, image_url, sequence_order)
        VALUES (
          v_course_item->'course'->>'title',
          v_course_item->'course'->>'slug',
          v_course_item->'course'->>'description',
          v_course_item->'course'->>'image_url',
          COALESCE((v_course_item->'course'->>'sequence_order')::integer, 0)
        )
        RETURNING id INTO v_course_id;
        v_next_topic_order := 0;
      END IF;

      FOR v_topic IN SELECT * FROM jsonb_array_elements(COALESCE(v_course_item->'topics', '[]'::jsonb))
      LOOP
        INSERT INTO public.topics (course_id, title, slug, sequence_order)
        VALUES (
          v_course_id,
          v_topic->>'title',
          v_topic->>'slug',
          COALESCE((v_topic->>'sequence_order')::integer, v_next_topic_order)
        )
        RETURNING id INTO v_topic_id;
        v_next_topic_order := v_next_topic_order + 1;

        FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))
        LOOP
          INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)
          VALUES (
            v_topic_id,
            v_subtopic->>'title',
            COALESCE((v_subtopic->>'sequence_order')::integer, 0),
            COALESCE(v_subtopic->'content_json', '[]'::jsonb)
          )
          RETURNING id INTO v_subtopic_id;

          IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN
            INSERT INTO public.quizzes (subtopic_id, questions_json)
            VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');
          END IF;
        END LOOP;
      END LOOP;

      v_imported := v_imported || jsonb_build_object('title', v_title, 'id', v_course_id);
    EXCEPTION WHEN OTHERS THEN
      v_errors := v_errors || jsonb_build_object('title', v_title, 'error', SQLERRM);
    END;
  END LOOP;

  RETURN jsonb_build_object('imported', v_imported, 'errors', v_errors);
END;
$$;


ALTER FUNCTION "public"."admin_bulk_import_courses"("payload" "jsonb") OWNER TO "postgres";

--
-- Name: admin_bulk_import_topics_into_course("text", "jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_course_id uuid;
  v_topics jsonb := coalesce(payload->'topics', '[]'::jsonb);
  v_topic jsonb;
  v_subtopic jsonb;
  v_topic_id uuid;
  v_subtopic_id uuid;
  v_title text;
  v_imported jsonb := '[]'::jsonb;
  v_errors jsonb := '[]'::jsonb;
  v_base_order integer;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO v_course_id FROM public.courses WHERE slug = p_course_slug;
  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'No course found with slug "%"', p_course_slug;
  END IF;

  IF jsonb_typeof(v_topics) <> 'array' OR jsonb_array_length(v_topics) = 0 THEN
    RAISE EXCEPTION 'payload.topics must be a non-empty array';
  END IF;

  SELECT coalesce(max(sequence_order), -1) INTO v_base_order FROM public.topics WHERE course_id = v_course_id;

  FOR v_topic IN SELECT * FROM jsonb_array_elements(v_topics)
  LOOP
    v_title := v_topic->>'title';
    v_base_order := v_base_order + 1;
    BEGIN
      INSERT INTO public.topics (course_id, title, slug, sequence_order)
      VALUES (
        v_course_id,
        v_topic->>'title',
        v_topic->>'slug',
        v_base_order
      )
      RETURNING id INTO v_topic_id;

      FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))
      LOOP
        INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)
        VALUES (
          v_topic_id,
          v_subtopic->>'title',
          COALESCE((v_subtopic->>'sequence_order')::integer, 0),
          COALESCE(v_subtopic->'content_json', '[]'::jsonb)
        )
        RETURNING id INTO v_subtopic_id;

        IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN
          INSERT INTO public.quizzes (subtopic_id, questions_json)
          VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');
        END IF;
      END LOOP;

      v_imported := v_imported || jsonb_build_object('title', v_title, 'id', v_topic_id);
    EXCEPTION WHEN OTHERS THEN
      v_errors := v_errors || jsonb_build_object('title', v_title, 'error', SQLERRM);
    END;
  END LOOP;

  RETURN jsonb_build_object('course_id', v_course_id, 'imported', v_imported, 'errors', v_errors);
END;
$$;


ALTER FUNCTION "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb") OWNER TO "postgres";

--
-- Name: enforce_quiz_lockout(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."enforce_quiz_lockout"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_status jsonb;
BEGIN
  v_status := public.quiz_lockout_status(NEW.employee_id, NEW.module_slug);
  IF (v_status->>'locked')::boolean THEN
    RAISE EXCEPTION 'Quiz locked for this module until %', v_status->>'lockedUntil'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."enforce_quiz_lockout"() OWNER TO "postgres";

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.employees (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: is_admin("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."is_admin"("uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees WHERE id = uid AND role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"("uid" "uuid") OWNER TO "postgres";

--
-- Name: my_quiz_lockout_status("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."my_quiz_lockout_status"("p_module_slug" "text") RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT public.quiz_lockout_status(auth.uid(), p_module_slug);
$$;


ALTER FUNCTION "public"."my_quiz_lockout_status"("p_module_slug" "text") OWNER TO "postgres";

--
-- Name: quiz_lockout_status("uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."quiz_lockout_status"("p_employee_id" "uuid", "p_module_slug" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_fail_streak int := 0;
  v_third_fail_at timestamptz := NULL;
  v_row RECORD;
  v_locked_until timestamptz;
BEGIN
  -- Walk attempts most-recent-first; count consecutive fails until a pass
  -- breaks the streak. This reads existing quiz_attempts data only -- no
  -- new write path needed, since recordQuizResult() already inserts a row
  -- per attempt with employee_id/module_slug/passed/attempted_at.
  FOR v_row IN
    SELECT passed, attempted_at
    FROM public.quiz_attempts
    WHERE employee_id = p_employee_id AND module_slug = p_module_slug
    ORDER BY attempted_at DESC
  LOOP
    IF v_row.passed THEN
      EXIT;
    END IF;
    v_fail_streak := v_fail_streak + 1;
    IF v_fail_streak = 3 THEN
      v_third_fail_at := v_row.attempted_at;
      EXIT;
    END IF;
  END LOOP;

  IF v_third_fail_at IS NOT NULL THEN
    v_locked_until := v_third_fail_at + interval '24 hours';
  END IF;

  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RETURN jsonb_build_object(
      'locked', true,
      'lockedUntil', v_locked_until,
       'failStreak', v_fail_streak
    );
  END IF;

  RETURN jsonb_build_object('locked', false, 'lockedUntil', null, 'failStreak', v_fail_streak);
END;
$$;


ALTER FUNCTION "public"."quiz_lockout_status"("p_employee_id" "uuid", "p_module_slug" "text") OWNER TO "postgres";

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

--
-- Name: apply_rls("jsonb", integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer DEFAULT (1024 * 1024)) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "plpgsql"
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) OWNER TO "supabase_realtime_admin";

--
-- Name: broadcast_changes("text", "text", "text", "text", "text", "record", "record", "text"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text" DEFAULT 'ROW'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text") OWNER TO "supabase_realtime_admin";

--
-- Name: build_prepared_statement_sql("text", "regclass", "realtime"."wal_column"[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) OWNER TO "supabase_realtime_admin";

--
-- Name: cast("text", "regtype"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") RETURNS "jsonb"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") OWNER TO "supabase_realtime_admin";

--
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


ALTER FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") OWNER TO "supabase_realtime_admin";

--
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) RETURNS boolean
    LANGUAGE "plpgsql" STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) OWNER TO "supabase_realtime_admin";

--
-- Name: is_visible_through_filters("realtime"."wal_column"[], "realtime"."user_defined_filter"[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) OWNER TO "supabase_realtime_admin";

--
-- Name: list_changes("name", "name", integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) RETURNS TABLE("wal" "jsonb", "is_rls_enabled" boolean, "subscription_ids" "uuid"[], "errors" "text"[], "slot_changes_count" bigint)
    LANGUAGE "sql"
    SET "log_min_messages" TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) OWNER TO "supabase_realtime_admin";

--
-- Name: quote_wal2json("regclass"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."quote_wal2json"("entity" "regclass") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION "realtime"."quote_wal2json"("entity" "regclass") OWNER TO "supabase_realtime_admin";

--
-- Name: send("jsonb", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean) OWNER TO "supabase_realtime_admin";

--
-- Name: send_binary("bytea", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION "realtime"."send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean) OWNER TO "supabase_realtime_admin";

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."subscription_check_filters"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION "realtime"."subscription_check_filters"() OWNER TO "supabase_realtime_admin";

--
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION "realtime"."to_regrole"("role_name" "text") OWNER TO "supabase_realtime_admin";

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION "realtime"."topic"() OWNER TO "supabase_realtime_admin";

--
-- Name: wal2json_escape_identifier("text"); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION "realtime"."wal2json_escape_identifier"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION "realtime"."wal2json_escape_identifier"("name" "text") OWNER TO "supabase_realtime_admin";

--
-- Name: allow_any_operation("text"[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."allow_any_operation"("expected_operations" "text"[]) RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION "storage"."allow_any_operation"("expected_operations" "text"[]) OWNER TO "supabase_storage_admin";

--
-- Name: allow_only_operation("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."allow_only_operation"("expected_operation" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION "storage"."allow_only_operation"("expected_operation" "text") OWNER TO "supabase_storage_admin";

--
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") OWNER TO "supabase_storage_admin";

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION "storage"."enforce_bucket_name_length"() OWNER TO "supabase_storage_admin";

--
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION "storage"."extension"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    RETURN _parts[array_length(_parts, 1)];
END
$$;


ALTER FUNCTION "storage"."filename"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION "storage"."foldername"("name" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_common_prefix("text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_common_prefix"("p_key" "text", "p_prefix" "text", "p_delimiter" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION "storage"."get_common_prefix"("p_key" "text", "p_prefix" "text", "p_delimiter" "text") OWNER TO "supabase_storage_admin";

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION "storage"."get_size_by_bucket"() OWNER TO "supabase_storage_admin";

--
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text") OWNER TO "supabase_storage_admin";

--
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text", "sort_order" "text") OWNER TO "supabase_storage_admin";

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION "storage"."operation"() OWNER TO "supabase_storage_admin";

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."protect_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "storage"."protect_delete"() OWNER TO "supabase_storage_admin";

--
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";

--
-- Name: search_by_timestamp("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search_by_timestamp"("p_prefix" "text", "p_bucket_id" "text", "p_limit" integer, "p_level" integer, "p_start_after" "text", "p_sort_order" "text", "p_sort_column" "text", "p_sort_column_after" "text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION "storage"."search_by_timestamp"("p_prefix" "text", "p_bucket_id" "text", "p_limit" integer, "p_level" integer, "p_start_after" "text", "p_sort_order" "text", "p_sort_column" "text", "p_sort_column_after" "text") OWNER TO "supabase_storage_admin";

--
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text") OWNER TO "supabase_storage_admin";

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_storage_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE "auth"."audit_log_entries" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."custom_oauth_providers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "provider_type" "text" NOT NULL,
    "identifier" "text" NOT NULL,
    "name" "text" NOT NULL,
    "client_id" "text" NOT NULL,
    "client_secret" "text" NOT NULL,
    "acceptable_client_ids" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "scopes" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pkce_enabled" boolean DEFAULT true NOT NULL,
    "attribute_mapping" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "authorization_params" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL,
    "email_optional" boolean DEFAULT false NOT NULL,
    "issuer" "text",
    "discovery_url" "text",
    "skip_nonce_check" boolean DEFAULT false NOT NULL,
    "cached_discovery" "jsonb",
    "discovery_cached_at" timestamp with time zone,
    "authorization_url" "text",
    "token_url" "text",
    "userinfo_url" "text",
    "jwks_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "custom_claims_allowlist" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    CONSTRAINT "custom_oauth_providers_authorization_url_https" CHECK ((("authorization_url" IS NULL) OR ("authorization_url" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_authorization_url_length" CHECK ((("authorization_url" IS NULL) OR ("char_length"("authorization_url") <= 2048))),
    CONSTRAINT "custom_oauth_providers_client_id_length" CHECK ((("char_length"("client_id") >= 1) AND ("char_length"("client_id") <= 512))),
    CONSTRAINT "custom_oauth_providers_discovery_url_length" CHECK ((("discovery_url" IS NULL) OR ("char_length"("discovery_url") <= 2048))),
    CONSTRAINT "custom_oauth_providers_identifier_format" CHECK (("identifier" ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::"text")),
    CONSTRAINT "custom_oauth_providers_issuer_length" CHECK ((("issuer" IS NULL) OR (("char_length"("issuer") >= 1) AND ("char_length"("issuer") <= 2048)))),
    CONSTRAINT "custom_oauth_providers_jwks_uri_https" CHECK ((("jwks_uri" IS NULL) OR ("jwks_uri" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_jwks_uri_length" CHECK ((("jwks_uri" IS NULL) OR ("char_length"("jwks_uri") <= 2048))),
    CONSTRAINT "custom_oauth_providers_name_length" CHECK ((("char_length"("name") >= 1) AND ("char_length"("name") <= 100))),
    CONSTRAINT "custom_oauth_providers_oauth2_requires_endpoints" CHECK ((("provider_type" <> 'oauth2'::"text") OR (("authorization_url" IS NOT NULL) AND ("token_url" IS NOT NULL) AND ("userinfo_url" IS NOT NULL)))),
    CONSTRAINT "custom_oauth_providers_oidc_discovery_url_https" CHECK ((("provider_type" <> 'oidc'::"text") OR ("discovery_url" IS NULL) OR ("discovery_url" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_oidc_issuer_https" CHECK ((("provider_type" <> 'oidc'::"text") OR ("issuer" IS NULL) OR ("issuer" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_oidc_requires_issuer" CHECK ((("provider_type" <> 'oidc'::"text") OR ("issuer" IS NOT NULL))),
    CONSTRAINT "custom_oauth_providers_provider_type_check" CHECK (("provider_type" = ANY (ARRAY['oauth2'::"text", 'oidc'::"text"]))),
    CONSTRAINT "custom_oauth_providers_token_url_https" CHECK ((("token_url" IS NULL) OR ("token_url" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_token_url_length" CHECK ((("token_url" IS NULL) OR ("char_length"("token_url") <= 2048))),
    CONSTRAINT "custom_oauth_providers_userinfo_url_https" CHECK ((("userinfo_url" IS NULL) OR ("userinfo_url" ~~ 'https://%'::"text"))),
    CONSTRAINT "custom_oauth_providers_userinfo_url_length" CHECK ((("userinfo_url" IS NULL) OR ("char_length"("userinfo_url") <= 2048)))
);


ALTER TABLE "auth"."custom_oauth_providers" OWNER TO "supabase_auth_admin";

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "code_challenge" "text",
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone,
    "invite_token" "text",
    "referrer" "text",
    "oauth_client_state_id" "uuid",
    "linking_target_id" "uuid",
    "email_optional" boolean DEFAULT false NOT NULL
);


ALTER TABLE "auth"."flow_state" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."flow_state" IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "auth"."identities" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "auth"."instances" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" "text",
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK (("char_length"("nonce") <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


ALTER TABLE "auth"."oauth_authorizations" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_client_states" (
    "id" "uuid" NOT NULL,
    "provider_type" "text" NOT NULL,
    "code_verifier" "text",
    "created_at" timestamp with time zone NOT NULL
);


ALTER TABLE "auth"."oauth_client_states" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "oauth_client_states"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."oauth_client_states" IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    "token_endpoint_auth_method" "text" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048)),
    CONSTRAINT "oauth_clients_token_endpoint_auth_method_check" CHECK (("token_endpoint_auth_method" = ANY (ARRAY['client_secret_basic'::"text", 'client_secret_post'::"text", 'none'::"text"])))
);


ALTER TABLE "auth"."oauth_clients" OWNER TO "supabase_auth_admin";

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


ALTER TABLE "auth"."oauth_consents" OWNER TO "supabase_auth_admin";

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_auth_admin";

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_auth_admin";

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


ALTER TABLE "auth"."schema_migrations" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint,
    "scopes" "text",
    CONSTRAINT "sessions_scopes_length" CHECK (("char_length"("scopes") <= 4096))
);


ALTER TABLE "auth"."sessions" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


ALTER TABLE "auth"."users" OWNER TO "supabase_auth_admin";

--
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."webauthn_challenges" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "challenge_type" "text" NOT NULL,
    "session_data" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    CONSTRAINT "webauthn_challenges_challenge_type_check" CHECK (("challenge_type" = ANY (ARRAY['signup'::"text", 'registration'::"text", 'authentication'::"text"])))
);


ALTER TABLE "auth"."webauthn_challenges" OWNER TO "supabase_auth_admin";

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE "auth"."webauthn_credentials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "credential_id" "bytea" NOT NULL,
    "public_key" "bytea" NOT NULL,
    "attestation_type" "text" DEFAULT ''::"text" NOT NULL,
    "aaguid" "uuid",
    "sign_count" bigint DEFAULT 0 NOT NULL,
    "transports" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "backup_eligible" boolean DEFAULT false NOT NULL,
    "backed_up" boolean DEFAULT false NOT NULL,
    "friendly_name" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_used_at" timestamp with time zone
);


ALTER TABLE "auth"."webauthn_credentials" OWNER TO "supabase_auth_admin";

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "sequence_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_published" boolean DEFAULT true NOT NULL,
    CONSTRAINT "courses_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text")),
    CONSTRAINT "courses_title_check" CHECK (("char_length"(TRIM(BOTH FROM "title")) > 0))
);


ALTER TABLE "public"."courses" OWNER TO "postgres";

--
-- Name: employee_skill_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."employee_skill_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "skill_id" "uuid" NOT NULL,
    "proficiency_pct" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "employee_skill_progress_proficiency_pct_check" CHECK ((("proficiency_pct" >= 0) AND ("proficiency_pct" <= 100)))
);


ALTER TABLE "public"."employee_skill_progress" OWNER TO "postgres";

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "text" DEFAULT 'student'::"text" NOT NULL,
    CONSTRAINT "employees_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."employees" OWNER TO "postgres";

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "module_slug" "text" NOT NULL,
    "enrolled_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    CONSTRAINT "enrollments_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'completed'::"text", 'dropped'::"text"])))
);


ALTER TABLE "public"."enrollments" OWNER TO "postgres";

--
-- Name: glossary_terms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."glossary_terms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "term" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "definition" "text" NOT NULL,
    "simple_explanation" "text",
    "used_in" "text",
    "related_topic_slugs" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "glossary_terms_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text")),
    CONSTRAINT "glossary_terms_term_check" CHECK (("char_length"(TRIM(BOTH FROM "term")) > 0))
);


ALTER TABLE "public"."glossary_terms" OWNER TO "postgres";

--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."lesson_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "module_slug" "text" NOT NULL,
    "lesson_id" "text" NOT NULL,
    "completed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lesson_progress" OWNER TO "postgres";

--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."quiz_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "module_slug" "text" NOT NULL,
    "score_pct" integer NOT NULL,
    "passed" boolean DEFAULT false NOT NULL,
    "attempted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "quiz_attempts_score_pct_check" CHECK ((("score_pct" >= 0) AND ("score_pct" <= 100)))
);


ALTER TABLE "public"."quiz_attempts" OWNER TO "postgres";

--
-- Name: module_certifications; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW "public"."module_certifications" WITH ("security_invoker"='true') AS
 SELECT "employee_id",
    "module_slug",
    "max"("score_pct") AS "best_score_pct",
    "bool_or"("passed") AS "certified",
    "min"("attempted_at") FILTER (WHERE "passed") AS "certified_at"
   FROM "public"."quiz_attempts"
  GROUP BY "employee_id", "module_slug";


ALTER VIEW "public"."module_certifications" OWNER TO "postgres";

--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."quizzes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subtopic_id" "uuid" NOT NULL,
    "questions_json" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quizzes" OWNER TO "postgres";

--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "sequence_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "skills_name_check" CHECK (("char_length"(TRIM(BOTH FROM "name")) > 0)),
    CONSTRAINT "skills_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text"))
);


ALTER TABLE "public"."skills" OWNER TO "postgres";

--
-- Name: subtopics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."subtopics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "sequence_order" integer DEFAULT 0 NOT NULL,
    "content_json" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "est_minutes" integer,
    "learning_objectives" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "skills" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "glossary_terms" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "completion_rule" "text" DEFAULT 'read'::"text" NOT NULL,
    CONSTRAINT "subtopics_completion_rule_check" CHECK (("completion_rule" = ANY (ARRAY['read'::"text", 'interactive'::"text", 'practice'::"text", 'challenge'::"text", 'assessment'::"text"]))),
    CONSTRAINT "subtopics_title_check" CHECK (("char_length"(TRIM(BOTH FROM "title")) > 0))
);


ALTER TABLE "public"."subtopics" OWNER TO "postgres";

--
-- Name: topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."topics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "sequence_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "difficulty" "text",
    "est_minutes" integer,
    "description" "text",
    "learning_objectives" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "skills" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "prerequisite_topic_id" "uuid",
    CONSTRAINT "topics_slug_check" CHECK (("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::"text")),
    CONSTRAINT "topics_title_check" CHECK (("char_length"(TRIM(BOTH FROM "title")) > 0))
);


ALTER TABLE "public"."topics" OWNER TO "postgres";

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE "realtime"."messages" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "binary_payload" "bytea"
)
PARTITION BY RANGE ("inserted_at");


ALTER TABLE "realtime"."messages" OWNER TO "supabase_realtime_admin";

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone DEFAULT "now"()
);


ALTER TABLE "realtime"."schema_migrations" OWNER TO "supabase_admin";

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "entity" "regclass" NOT NULL,
    "filters" "realtime"."user_defined_filter"[] DEFAULT '{}'::"realtime"."user_defined_filter"[] NOT NULL,
    "claims" "jsonb" NOT NULL,
    "claims_role" "regrole" GENERATED ALWAYS AS ("realtime"."to_regrole"(("claims" ->> 'role'::"text"))) STORED NOT NULL,
    "created_at" timestamp without time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "action_filter" "text" DEFAULT '*'::"text",
    "selected_columns" "text"[],
    CONSTRAINT "subscription_action_filter_check" CHECK (("action_filter" = ANY (ARRAY['*'::"text", 'INSERT'::"text", 'UPDATE'::"text", 'DELETE'::"text"])))
);


ALTER TABLE "realtime"."subscription" OWNER TO "supabase_realtime_admin";

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE "realtime"."subscription" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "realtime"."subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


ALTER TABLE "storage"."buckets" OWNER TO "supabase_storage_admin";

--
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "storage"."buckets_analytics" OWNER TO "supabase_storage_admin";

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."buckets_vectors" OWNER TO "supabase_storage_admin";

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "storage"."migrations" OWNER TO "supabase_storage_admin";

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."objects" OWNER TO "supabase_storage_admin";

--
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb",
    "metadata" "jsonb"
);


ALTER TABLE "storage"."s3_multipart_uploads" OWNER TO "supabase_storage_admin";

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."s3_multipart_uploads_parts" OWNER TO "supabase_storage_admin";

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."vector_indexes" OWNER TO "supabase_storage_admin";

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE "supabase_migrations"."schema_migrations" (
    "version" "text" NOT NULL,
    "statements" "text"[],
    "name" "text",
    "created_by" "text",
    "idempotency_key" "text",
    "rollback" "text"[]
);


ALTER TABLE "supabase_migrations"."schema_migrations" OWNER TO "postgres";

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at", "custom_claims_allowlist") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
102792262892028105464	bd83ba32-0763-4fa4-a363-9ace943a363a	{"iss": "https://accounts.google.com", "sub": "102792262892028105464", "name": "Hatim GW", "email": "hatim@quitebinary.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocI5d2ighNrUZumK66BPokAFHmW_txtvVkRfBP8nt8su6YoabQ=s96-c", "full_name": "Hatim GW", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocI5d2ighNrUZumK66BPokAFHmW_txtvVkRfBP8nt8su6YoabQ=s96-c", "provider_id": "102792262892028105464", "custom_claims": {"hd": "quitebinary.com"}, "email_verified": true, "phone_verified": false}	google	2026-08-11 10:49:59.713053+00	2026-08-11 10:49:59.713119+00	2026-08-13 05:56:55.341181+00	5bda0523-902e-499f-905e-674eaa295e14
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
f3747953-b08d-464b-8c11-5a83a4bc1c0c	2026-08-12 20:12:10.644332+00	2026-08-12 20:12:10.644332+00	oauth	18fe0002-3b8b-43f2-9ab3-d71cc65d113e
37fb6669-7eef-4906-bb66-c0846316abc4	2026-08-13 05:56:57.576361+00	2026-08-13 05:56:57.576361+00	oauth	0bd5b7a1-928c-4194-9bcf-c0c77664c995
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	24	dkv2qjsjhswm	bd83ba32-0763-4fa4-a363-9ace943a363a	t	2026-08-12 20:12:10.628817+00	2026-08-13 04:49:40.365987+00	\N	f3747953-b08d-464b-8c11-5a83a4bc1c0c
00000000-0000-0000-0000-000000000000	25	fdajgbhwdejh	bd83ba32-0763-4fa4-a363-9ace943a363a	f	2026-08-13 04:49:40.380708+00	2026-08-13 04:49:40.380708+00	dkv2qjsjhswm	f3747953-b08d-464b-8c11-5a83a4bc1c0c
00000000-0000-0000-0000-000000000000	26	u33fbq3njirn	bd83ba32-0763-4fa4-a363-9ace943a363a	t	2026-08-13 05:56:57.567893+00	2026-08-13 06:55:45.779871+00	\N	37fb6669-7eef-4906-bb66-c0846316abc4
00000000-0000-0000-0000-000000000000	27	kqovtzq5pcom	bd83ba32-0763-4fa4-a363-9ace943a363a	f	2026-08-13 06:55:45.799022+00	2026-08-13 06:55:45.799022+00	u33fbq3njirn	37fb6669-7eef-4906-bb66-c0846316abc4
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
f3747953-b08d-464b-8c11-5a83a4bc1c0c	bd83ba32-0763-4fa4-a363-9ace943a363a	2026-08-12 20:12:10.62413+00	2026-08-13 04:49:43.01596+00	\N	aal1	\N	2026-08-13 04:49:43.015846	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	152.58.59.207	\N	\N	\N	\N	\N
37fb6669-7eef-4906-bb66-c0846316abc4	bd83ba32-0763-4fa4-a363-9ace943a363a	2026-08-13 05:56:57.557328+00	2026-08-13 06:55:45.823658+00	\N	aal1	\N	2026-08-13 06:55:45.823553	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	49.43.4.189	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	bd83ba32-0763-4fa4-a363-9ace943a363a	authenticated	authenticated	hatim@quitebinary.com	\N	2026-08-11 10:49:59.720467+00	\N		\N		\N			\N	2026-08-13 05:56:57.555996+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "102792262892028105464", "name": "Hatim GW", "email": "hatim@quitebinary.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocI5d2ighNrUZumK66BPokAFHmW_txtvVkRfBP8nt8su6YoabQ=s96-c", "full_name": "Hatim GW", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocI5d2ighNrUZumK66BPokAFHmW_txtvVkRfBP8nt8su6YoabQ=s96-c", "provider_id": "102792262892028105464", "custom_claims": {"hd": "quitebinary.com"}, "email_verified": true, "phone_verified": false}	\N	2026-08-11 10:49:59.701174+00	2026-08-13 06:55:45.807029+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."courses" ("id", "title", "slug", "description", "image_url", "sequence_order", "created_at", "updated_at", "is_published") FROM stdin;
48179869-6ae4-40c6-b676-c5ec7d43b054	Epicor Kinetic BAQ - Complete Developer Training	epicor-kinetic-baq-complete-developer-training	A complete, practical BAQ learning path covering Query Designer fundamentals, tables and joins, filters and parameters, calculated fields, grouping and subqueries, testing and security, Kinetic DataViews and combos, Updatable BAQs and BPM update processing, BAQ Reports, REST integration, and hands-on labs. Expanded from the supplied Epicor training documents with additional research from current official Epicor BAQ materials.	https://bcrovxnarohytinnqkrp.supabase.co/storage/v1/object/public/course-assets/epicor-baq-training-cover.png	1	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	t
6b0e4eb1-baad-4306-9377-2966d272e1ad	Kinetic Application Studio	kinetic-application-studio	The complete Kinetic Application Studio curriculum, covering everything from fundamentals to advanced SDK development.	\N	0	2026-08-12 08:10:24.170984+00	2026-08-12 13:48:34.226823+00	t
\.


--
-- Data for Name: employee_skill_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employee_skill_progress" ("id", "employee_id", "skill_id", "proficiency_pct", "updated_at") FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employees" ("id", "email", "full_name", "created_at", "last_seen_at", "role") FROM stdin;
bd83ba32-0763-4fa4-a363-9ace943a363a	hatim@quitebinary.com	Hatim GW	2026-08-11 10:49:59.693822+00	2026-08-11 10:49:59.693822+00	admin
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."enrollments" ("id", "employee_id", "module_slug", "enrolled_at", "status") FROM stdin;
c16dc1f6-3e68-4cef-b328-72987a1fad3c	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	2026-08-11 14:54:25.282478+00	in_progress
2ca7f97d-bf40-486a-943c-50f7beacd163	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	2026-08-11 13:49:00.093897+00	in_progress
932be41b-cab0-4846-84fd-a33db8547ee7	bd83ba32-0763-4fa4-a363-9ace943a363a	components-and-layout	2026-08-11 19:11:19.664654+00	in_progress
6757e49b-f77c-4f9b-aac1-249da3f6b121	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	2026-08-12 12:05:09.343356+00	in_progress
9cc30bce-3fe5-4a9c-84ea-867872f5225b	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	2026-08-12 12:31:44.965122+00	in_progress
033418d6-7e6b-406d-b1d4-a832464d984e	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:epicor-basics	2026-08-12 13:02:55.398761+00	in_progress
9f2ec524-549a-420b-bba4-b9754dc144c5	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:example-course-title:example-topic	2026-08-12 13:17:51.195865+00	in_progress
ff8a8404-eecb-471c-a6c5-187a489786a5	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-dataviews-and-grids	2026-08-12 13:47:47.155655+00	in_progress
81b3e283-2df4-4035-9ed5-e924ec7c74b3	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	2026-08-12 14:03:58.070725+00	in_progress
8cb5deb3-3c00-4edf-a8b1-11c1a57999b8	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-tables-relationships-joins	2026-08-12 14:59:44.938974+00	in_progress
61c6361d-d900-4b44-a8b4-25b95f80ae16	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	2026-08-12 20:23:06.254168+00	in_progress
6bc11c41-d3db-4f2b-ad7f-d9747f71d836	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	2026-08-12 20:24:12.893627+00	in_progress
10370fdb-f9a4-4c72-a8a6-157b772d35cf	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:components-and-layout	2026-08-13 05:58:08.507861+00	in_progress
\.


--
-- Data for Name: glossary_terms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."glossary_terms" ("id", "term", "slug", "definition", "simple_explanation", "used_in", "related_topic_slugs", "created_at", "updated_at") FROM stdin;
6755336d-ac7e-4ac6-9a44-21a6917cd8a1	BAQ	baq	Business Activity Query: Epicor's reusable query definition for selecting, shaping, and exposing ERP data.	A BAQ is a saved data query you can reuse in Kinetic instead of writing a one-off report or integration query.	BAQ Designer, dashboards, reports, DataViews, searches, integrations, and BAQ-backed controls.	{baq-foundations-first-query,baq-tables-relationships-joins,baq-dataviews-grids-runtime-filtering}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
3e3c2f44-fe54-4104-bbb1-ab3d1c7663e6	BPM	bpm	Business Process Management: Epicor's server-side framework for applying logic before, during, or after business-object processing.	A BPM automates or checks ERP business processes when data is being processed.	Method directives, data directives, validation, notifications, and update processing.	{advanced-ubaq-bpm-processing,functions-server-logic}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
5983a540-6b97-4786-9883-579f6f356e1d	DataView	dataview	A client-side tabular data model that Kinetic components can bind to, filter, update, and use as an event context.	A DataView is the named set of rows and columns your Kinetic screen works with.	Application Studio bindings, grids, ComboBoxes, events, conditions, and BAQ results.	{dataviews-widgets-panels,baq-dataviews-grids-runtime-filtering,baq-combos-app-studio-events}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
65df571a-5f8b-4e75-8493-a412ce117422	UD Field	ud-field	A user-defined field added to an Epicor business table to store organization-specific information without altering standard product fields.	A UD Field is a custom data field your organization adds for information Epicor does not provide out of the box.	User-defined tables and forms, BPMs, BAQs, DataViews, and Application Studio bindings.	{components-and-layout,baq-dataviews-grids-runtime-filtering}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
c210afa4-164c-4511-b51f-b9b621fd0356	Layer	layer	An Application Studio configuration layer that applies changes over a base Kinetic application while keeping the base definition intact.	A layer is your safe customization overlay; it lets you change a screen without editing the standard app.	Application Studio customization, upgrade review, publishing, and governance.	{app-studio-fundamentals,layers-publishing-sdk}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
b6026146-ffe3-497f-9229-b11feb285a3a	Customization	customization	A deliberate change to an Epicor experience or process to meet organization-specific needs, commonly delivered through Application Studio layers, BPMs, or functions.	A customization changes Kinetic to fit how your organization works.	Application Studio, layers, BPMs, functions, security, testing, and release management.	{app-studio-fundamentals,layers-publishing-sdk}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
6499d8da-4c36-40b8-9dc6-660586e1c615	Widget	widget	A configurable Kinetic UI component used to display information, collect input, or trigger actions.	A widget is a building block on a Kinetic screen, such as a text box, grid, button, or ComboBox.	Application Studio layouts, forms, dashboards, grids, and data-entry experiences.	{components-and-layout,component-reference-library,dataviews-widgets-panels}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
849dd403-92cd-4f95-9dda-1cbfef4f2c2a	Event	event	A configured response to a Kinetic lifecycle or user interaction, such as a screen opening, a value changing, or a button being clicked.	An event tells Kinetic what to do when something happens.	Application Studio event editor, widget behavior, DataView changes, functions, and integration calls.	{data-rules-and-events,baq-combos-app-studio-events}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
c268f77f-668a-4c89-84df-d1332a23093e	Directive	directive	A BPM rule that runs at a defined point in business-object method processing or when a data change occurs.	A directive is the rule inside a BPM that decides when and how server-side logic runs.	Method directives, data directives, validation, automation, and updateable BAQ processing.	{advanced-ubaq-bpm-processing,updatable-baq-fundamentals}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
302f387e-ae0c-46e3-af70-3ff919ac5e09	Function	function	A reusable Epicor server-side unit of logic, organized in a Function Library and callable from Kinetic, BPMs, REST, and other clients.	A Function packages useful backend work so multiple apps and processes can call it.	Epicor Functions Maintenance, Application Studio events, BPMs, REST API v2, and integrations.	{functions-server-logic,baq-rest-integration}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
13348c1e-5d47-44fe-a6b7-7731b7f3ebef	REST	rest	A web API style that exposes resources and operations through HTTP requests; Kinetic REST API v2 provides programmatic access to Epicor services and functions.	REST is the web-based way an application sends requests to Epicor services.	Kinetic REST API v2, integrations, Application Studio service calls, BAQs, and functions.	{baq-rest-integration,functions-server-logic}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
995b7e26-3ea4-493f-9181-80eda0d240cd	ERP BAQ	erp-baq	An Application Studio event action that executes an Epicor BAQ and places its result set into a DataView for use by the client application.	ERP BAQ is how an App Studio event runs a saved BAQ and brings its results onto the screen.	Application Studio event actions, DataViews, BAQ-backed combos, grids, and runtime filtering.	{dataviews-widgets-panels,baq-dataviews-grids-runtime-filtering,baq-combos-app-studio-events}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
129ec20f-08bc-439a-a1be-23b7bb9bc107	Application Map	application-map	The Application Studio structure that represents an application's pages, tabs, panels, relationships, and navigation hierarchy.	The Application Map is the outline of how a Kinetic app is organized.	Application Studio design mode, page architecture, layout, navigation, and layer configuration.	{application-map-and-pages,components-and-layout}	2026-08-12 20:09:30.387419+00	2026-08-12 20:09:30.387419+00
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."lesson_progress" ("id", "employee_id", "module_slug", "lesson_id", "completed_at") FROM stdin;
b9929daa-1ebc-4e76-9b60-7eb381de914a	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	welcome	2026-08-11 18:49:02.666357+00
e8de6265-cd18-4d09-b05c-00a6ba5eb869	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	launching	2026-08-11 18:49:18.09396+00
24877773-fe67-4222-9e91-2c764298616e	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	layers-lifecycle	2026-08-11 18:49:25.010228+00
ecdebd06-d7cd-447c-9cae-9e11cd5ac218	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	designers	2026-08-11 18:49:28.795591+00
b64e7add-2c0f-4dc0-b7c0-0b826fa63355	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	mobile-and-debug	2026-08-11 18:49:30.724251+00
7a3695f0-7c30-40c7-a2c2-ed7465379678	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	shortcuts-and-save-as	2026-08-11 18:49:33.348937+00
8c4eb519-5524-4529-b7fd-ce8dba99e8cc	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	landing-page	2026-08-11 18:58:18.028228+00
cf133063-025e-4a26-a961-14fc8860aedb	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	tabs-and-pages	2026-08-11 19:03:16.086464+00
09557227-083f-4ef0-9ac5-d5a37509be07	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	sliding-panels	2026-08-11 19:03:24.616795+00
459ffdbb-394c-48aa-b217-2ec6c3c91dd1	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	flex-layout	2026-08-11 19:03:26.3698+00
a3d8c3e3-01e3-4818-b301-ef533669378d	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	new-pages-tabs	2026-08-11 19:03:28.732029+00
109273cc-0ee9-4767-a418-276f0a09cd4d	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	baq-reports-and-wizard	2026-08-11 19:03:30.540444+00
305c9c3d-fcba-4775-bb5e-988793d4542a	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	landing-page-tricks	2026-08-11 19:03:32.361514+00
3888e750-fc5d-4b14-a626-89785a78aa75	bd83ba32-0763-4fa4-a363-9ace943a363a	components-and-layout	component-model	2026-08-11 19:05:48.223097+00
0ba2af8c-dacb-4de2-9829-3bb89a9fa07d	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	login-client-vs-browser	2026-08-11 13:49:03.82621+00
2cf0434f-7c9e-491e-82fb-d847e7bd3b71	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	home-navigation	2026-08-11 13:49:28.665635+00
ca260cbf-7e31-4354-bccf-6686d3fce13b	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	c7964266-8e6b-40a8-825a-c8b4a56a4a1d	2026-08-12 12:29:50.662259+00
b15805cb-eca3-4a7b-9696-99690d9b72e6	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	5a452ea5-301d-49b0-84b3-aac9557739b8	2026-08-12 13:46:53.550886+00
7fd3b752-0ef9-4d4f-93a3-d17fed9c8941	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	3c391866-7214-4944-b718-ea790f943f15	2026-08-12 13:46:56.654112+00
ca3bc9e4-776f-408b-a4cd-f6bd877acaa5	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	784ccdb5-a7e1-4ba2-b808-396ae354b58c	2026-08-12 13:54:20.484472+00
464819db-58ba-4780-9563-13281244d221	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	0671ef21-2594-466a-9250-cc6d43e933a5	2026-08-12 14:04:27.165518+00
768c70ba-19ce-4650-9463-da19b591d0a2	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	243b507e-cd36-4373-ac55-41cb505db0f3	2026-08-12 14:04:44.367652+00
7da1ed59-44f5-4009-8e65-8f156f5fa076	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	933d1dfe-aa71-4c09-9813-9053b0bef134	2026-08-12 14:04:49.073878+00
a4b26dcd-577d-48dd-99a2-b34cb440e44c	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	bae96e0e-4349-4109-80e7-11cfc282f5c8	2026-08-12 14:04:51.838991+00
9233a091-3cd7-4758-924a-118010af2e55	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:epicor-basics	aafda54c-791b-40ce-8c13-27af273b5ca2	2026-08-12 19:17:32.237479+00
b43b1104-0cd8-48ae-988d-1941e5635ae9	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:epicor-basics	9a5392c2-f381-48b5-adc3-d630f11cb8dc	2026-08-12 19:17:46.623097+00
14d94f75-e315-4be2-9437-0de893cd5970	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	a94b459e-1681-4785-a669-c5b0971bb572	2026-08-12 19:46:39.196802+00
8805d3b6-4a15-4791-9e90-095e603a7c0a	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	184874b8-66d2-4692-95d4-bd9512a80800	2026-08-12 19:47:35.185212+00
37206c48-5742-4f50-b6c2-56d104d58dfe	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	04037f97-5bff-4406-9be4-7fcbe811ac81	2026-08-12 19:47:41.050215+00
d9f3a513-daaa-43ab-bc40-6c08b0fe5e57	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	c4039084-9d38-4af6-9ef5-7f355dc56164	2026-08-12 19:47:48.646266+00
d6e749f5-6635-4afe-95ca-c89887b857ea	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	e4b5663e-3443-4594-860a-5210c75d35b3	2026-08-12 20:23:23.44201+00
6c74e31a-f81a-4b88-82b5-7abb2599db57	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	0ad0cb8b-4721-4a61-a98e-590d059c34af	2026-08-12 20:23:28.183078+00
19caccc1-bf81-41da-919f-65b67a031c6a	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	42d231f7-679f-4ad2-be1e-2c91dbe8a09b	2026-08-12 20:23:33.294221+00
ea79edfa-c025-4886-aebd-d71a326cc453	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	b0d60149-718d-4683-b941-95fe592801a5	2026-08-12 20:23:37.598585+00
1d3bc81a-d0aa-4794-b78c-578277084e47	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	560629b6-3e24-4c7d-ae60-0594f0a27a78	2026-08-12 20:23:40.809485+00
f120ac4b-7976-45bd-b9fd-606ea9561a83	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	1f71d11d-82df-4adf-866c-3cef11839d07	2026-08-12 20:23:45.872842+00
bc3ccecc-4ddb-4e32-97c2-f9afcb1d069b	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	8d8134a1-7cf5-468f-8749-ef3b8e17b851	2026-08-12 20:24:29.696829+00
f3802405-df0c-47ca-8b57-c0ae6bcf6c26	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	11ed38f9-8744-4510-9623-e56486d68765	2026-08-12 20:24:33.183488+00
f4a620bd-90a4-4936-8150-f3de2d44635d	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	64720cb1-6d41-42a4-b1a6-8cfbf9905aac	2026-08-12 20:24:35.967509+00
420c1424-6fda-4da6-a14f-f0077c896137	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	651e5d60-f349-4a18-a683-4fa330f5432d	2026-08-12 20:24:38.831166+00
232c012d-1035-4834-bc74-b90a4f1f75fb	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	4623dda5-4120-434a-90be-8c79590a9065	2026-08-12 20:24:41.181948+00
9213270c-6430-46e1-88e2-8b57f9b85182	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	48433b84-255f-49e8-bfe9-76a94709db07	2026-08-12 20:24:48.370964+00
36209616-1a5f-4aa4-b2da-ecb83450dfae	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	835868e8-29ba-4874-af28-80b371532bb3	2026-08-12 20:24:51.729356+00
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."quiz_attempts" ("id", "employee_id", "module_slug", "score_pct", "passed", "attempted_at") FROM stdin;
4db479b7-0a80-4fe5-8c7e-3f713930eb9d	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	80	t	2026-08-11 13:50:30.518391+00
aa855a3a-9c44-491a-ac62-ef3e4153538a	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	100	t	2026-08-11 14:54:01.129747+00
cbdad980-9012-4e54-a6e7-68209ede5cde	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	100	t	2026-08-11 14:55:10.978525+00
c039031e-a322-4f8b-ae7f-7153f1a20a57	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	100	t	2026-08-11 18:47:35.353146+00
45d25942-4ecb-4725-9433-6aac9d7f4103	bd83ba32-0763-4fa4-a363-9ace943a363a	app-studio-fundamentals	100	t	2026-08-11 18:58:10.765623+00
74529710-0f65-45e1-a558-d957e9365d8e	bd83ba32-0763-4fa4-a363-9ace943a363a	application-map-and-pages	100	t	2026-08-11 19:05:34.982582+00
dbbd8e54-ca31-4a96-8170-637a1dd7eff8	bd83ba32-0763-4fa4-a363-9ace943a363a	epicor-basics	100	t	2026-08-12 05:23:14.510562+00
d3bf3f9e-27f6-4e6d-a597-d6ede5f08ee3	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	100	t	2026-08-12 13:47:33.89822+00
41fb04d1-9106-4b9b-821d-1e6314f09c5b	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-query-ui-integration:baq-foundations-in-kinetic	100	t	2026-08-12 13:54:35.39281+00
464871d8-7bcb-4603-89b6-2727eaf62336	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	100	t	2026-08-12 14:05:13.983045+00
874c88fb-039c-477b-8a16-1fa80cb49693	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	60	f	2026-08-12 14:14:28.90536+00
85af7fcb-ef35-4a74-a700-d763797569e4	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	100	t	2026-08-12 14:15:56.594057+00
02b0608b-0196-4c1b-94c2-4108317de8ed	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:epicor-kinetic-baq-complete-developer-training:baq-foundations-first-query	100	t	2026-08-12 14:53:31.402274+00
a77e7431-fca8-467c-a522-c479b17c5b91	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:epicor-basics	100	t	2026-08-12 20:22:53.193988+00
221e41a9-621d-496e-8a49-d5e53af8b6a8	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:app-studio-fundamentals	100	t	2026-08-12 20:24:07.055209+00
e7549398-c71f-4fc6-968a-ad694a8a68cb	bd83ba32-0763-4fa4-a363-9ace943a363a	cms:kinetic-application-studio:application-map-and-pages	100	t	2026-08-13 04:50:42.21776+00
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."quizzes" ("id", "subtopic_id", "questions_json", "created_at", "updated_at") FROM stdin;
010a2c98-af45-4876-8b46-8d96246e83bb	1f71d11d-82df-4adf-866c-3cef11839d07	[{"options": ["Dashboard Developer rights only", "Customize Privileges checkbox in User Account Security Maintenance", "SDK license key", "Administrator role"], "question": "What must be enabled on a user account before they can use Application Studio?", "explanation": "Customize Privileges must be checked in User Account Security Maintenance to unlock Application Studio.", "correctIndex": 1}, {"options": ["Personalizations are faster to load", "A personalization is user-specific; a layer/customization is available to everyone in the company", "Layers can only be created by Epicor support", "There is no functional difference"], "question": "What is the key difference between a personalization and a layer/customization?", "explanation": "Personalizations save to one user's account only. Layers (customizations) can be shared across the whole company via Menu Maintenance.", "correctIndex": 1}, {"options": ["Draft", "Locked", "Archived", "Production"], "question": "After saving a layer, what status does it have until you explicitly publish it?", "explanation": "Saves always create a Draft. Only Publish makes the layer selectable in Menu Maintenance for other users.", "correctIndex": 0}, {"options": ["The first layer selected", "The layer with the shortest name", "The last layer selected/applied", "They cancel out and nothing displays"], "question": "When two layers conflict on the same component, which one wins?", "explanation": "The last layer in the selected order has precedence and overrides conflicting changes from earlier layers.", "correctIndex": 2}, {"options": ["Application Map", "Layout", "Data Rules", "DataViews"], "question": "Which designer would you use to define that a discount field turns red when it exceeds 8%?", "explanation": "Data Rules define conditions (discount > 8) and actions (highlight/disable/etc.) without writing code.", "correctIndex": 2}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00
4200fc2b-b6db-4c5d-87ca-d5822bad1f3d	835868e8-29ba-4874-af28-80b371532bb3	[{"options": ["The Tab Page", "The Landing Page", "The Virtual Page", "The Sliding Panel"], "question": "What defines what a user sees immediately when an application launches?", "explanation": "The Landing Page is the entry point, usually a searchable grid bound to a dynamic dataview.", "correctIndex": 1}, {"options": ["A TabStrip with Multi-select enabled", "A PanelCard or PanelCardGrid with Enable Full Screen enabled", "A GroupBox with Orientation set to horizontal", "A Button with Behavior set to Navigate"], "question": "A Virtual Page is technically which type of component with a special property enabled?", "explanation": "Virtual Pages are just PanelCard/PanelCardGrid components with the Advanced 'Enable Full Screen' property turned on.", "correctIndex": 1}, {"options": ["Top", "Bottom", "Left", "Right"], "question": "Which direction do Sliding Panels enter the screen from?", "explanation": "Sliding Panels slide out from the right side of the application.", "correctIndex": 3}, {"options": ["It hides two of the three cards", "It stacks the cards vertically", "It arranges the three cards side by side", "It disables the cards"], "question": "What does setting Minimum Width to 33 on three panel cards using FlexLayout achieve?", "explanation": "FlexLayout with matching Minimum Width percentages arranges panel cards in a row instead of stacking.", "correctIndex": 2}, {"options": ["The page's Name/TabID and the TabStrip entry's Id/Title", "The page's color scheme and the TabStrip's background", "The page's dataset and the company code", "Nothing needs to match, Kinetic auto-links them"], "question": "When wiring a new Page into a TabStrip, what must match exactly to avoid validation errors?", "explanation": "The Page Name/TabID must match the TabStrip's Id/Title entry, or Application Studio will raise a validation error.", "correctIndex": 0}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00
5abf4d17-8f60-44bb-b093-3c132b8a7d86	ffd40c9a-c6cb-4806-93ed-8912c8b5e57f	[{"options": ["Button", "TextBox", "PanelCard", "ComboBox"], "question": "Which of these can be dropped directly onto an empty page?", "explanation": "PanelCard (and PanelCardGrid/PanelCardGantt) are host containers that can sit directly on a page; leaf controls must go inside one.", "correctIndex": 2}, {"options": ["It improves rendering performance", "It's required for the component to be visible", "You'll reference this Id constantly in Events and Data Rules, so a meaningful name saves confusion", "IDs longer than 5 characters break the layout engine"], "question": "Why should you rename a component's default auto-generated Id?", "explanation": "Meaningful IDs make it far easier to wire up Events and Data Rules correctly later.", "correctIndex": 2}, {"options": ["The field is deleted from the layout", "End users can no longer hide/show it via personalization, but it stays visible in the layout", "The field becomes editable by everyone", "It converts the field into a system field"], "question": "What happens if you clear the 'Personalizable' checkbox on a field?", "explanation": "Clearing Personalizable locks the field against end-user personalization changes while leaving it in the layout.", "correctIndex": 1}, {"options": ["The user loses customization rights", "Its parent container is removed from a layer/base app but the component still exists on another layer", "The dataview it's bound to is renamed", "The layer was never published"], "question": "What causes a component to become 'orphaned' after an upgrade?", "explanation": "Orphaning happens when a container (card, group box, etc.) is removed but a component from another layer still expects to live inside it.", "correctIndex": 1}, {"options": ["Buttons", "Grids", "Widgets or other custom components", "Text boxes"], "question": "What can a custom (SDK) reusable component NOT contain?", "explanation": "Custom components can host standard base controls but not widgets or other user-defined custom components.", "correctIndex": 2}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00
68f103e2-b6eb-438e-8dc6-75ac148cfff5	a09b5942-88f5-417f-84af-fc6b99b17359	[{"options": ["Error", "Warning", "Ok", "Highlight"], "question": "In the highlight color convention, what does Orange represent?", "explanation": "Orange = Warning, Red = Error, Green = Ok, Blue = Highlight.", "correctIndex": 1}, {"options": ["Yes, directly and freely", "No — you can only copy it and edit the copy", "Only if you have the SDK license", "Only during a version upgrade window"], "question": "Can you edit a system rule that ships with the base application?", "explanation": "System rules can be copied but never edited or deleted directly.", "correctIndex": 1}, {"options": ["Delete records across companies", "Trigger an action on one dataview based on a condition evaluated on a different dataview", "Merge two dataviews into one", "Convert a classic dataview to Kinetic automatically"], "question": "What does a Cross-DataView Rule allow you to do?", "explanation": "Cross-DataView Rules let a condition on Dataview A drive an action on Dataview B.", "correctIndex": 1}, {"options": ["Before", "After", "Override", "OnClick"], "question": "Which 2023.2 event hook type replaces a system event's behavior entirely?", "explanation": "The Override hook runs your custom event INSTEAD of the targeted system event.", "correctIndex": 2}, {"options": ["It disables all data rules", "It can cause race conditions if the user changes context mid-workflow", "It permanently locks the record", "It prevents publishing the layer"], "question": "What risk does 'Allow interaction during events' introduce?", "explanation": "Letting users interact while an event runs can create race conditions if your workflow assumed a static context.", "correctIndex": 1}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00
d0f01e02-1d67-4103-a26a-6d769f855a49	62c77292-6f72-4810-954f-edd63d5482e8	[{"options": ["TransView", "Constant", "matches", "sysTools"], "question": "Which system dataview would you use to reference 'CurrentUserID' or 'Today' without hardcoding values?", "explanation": "The Constant dataview exposes ready-made system values like CompanyID, CurrentUserID, and Today.", "correctIndex": 1}, {"options": ["DataView->Column==Value", "DataView.Column = 'Value' (comma-separated for multiple criteria)", "Column:Value;DataView", "SELECT Column FROM DataView WHERE Value"], "question": "What is the correct format for a static filter on a dataview?", "explanation": "Static filters use DataView.Column = 'Value' syntax, with commas separating multiple criteria.", "correctIndex": 1}, {"options": ["Data Discovery Card", "Data Discovery Chart", "Website Widget", "PDF Viewer"], "question": "Which widget lets you embed a fully external HTTPS page with dynamic data injected via curly braces?", "explanation": "The Website Widget embeds an external URL and supports {DataView.Column} injection.", "correctIndex": 2}, {"options": ["Delete the classic dashboard", "Generate it as a Kinetic UX application via Deploy Dashboard", "Convert it to a BAQ Report", "Nothing, classic dashboards open directly in Application Studio"], "question": "Before you can style a classic dashboard in Application Studio, what must you do first?", "explanation": "You must copy and Deploy Dashboard to generate a Kinetic UX version before Application Studio can style it.", "correctIndex": 1}, {"options": ["Button → Data Rule → Publish", "Action button → Event (OnClick) → slider-open action targeting the panel's Page ID", "GroupBox → Widget → DataView", "Layer → Merge Layers → Preview"], "question": "What is the correct 3-step recipe for a button-triggered sliding panel?", "explanation": "Add an action button, hook an OnClick event, and use a slider-open action pointing at the sliding panel's Page property.", "correctIndex": 1}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00
46418f54-4e71-4ef5-a313-54bbc090bdbb	001f9763-7e95-4d78-a0d2-b26257ba5fb1	[{"options": ["Dashboard Developer rights", "Customize Privileges", "SDK license", "Administrator role"], "question": "What license unlocks creating brand-new applications from scratch in Application Studio?", "explanation": "The SDK license unlocks the 'Add New' application templates (Apps, Configurator, Dashboard, Process, Report, Shared).", "correctIndex": 2}, {"options": ["A CustomizationConversionSettings XML file with at least a Key1 tag", "A CSV export from Menu Maintenance", "A BPM directive", "There is no way to limit scope"], "question": "What must you provide to limit the Classic-to-Kinetic conversion program to specific applications?", "explanation": "An XML settings file with a mandatory Key1 tag lets you target specific applications/layers for conversion.", "correctIndex": 0}, {"options": ["It converted perfectly, no action needed", "It partially converted and requires editing in Application Studio", "It failed completely and must be rebuilt from scratch", "It was skipped entirely"], "question": "In the Configuration Upgrade Dashboard, what does a 'Warning' status mean for a converted layer?", "explanation": "Warning means partial conversion — you need to finish the job manually in Application Studio.", "correctIndex": 1}, {"options": ["Only the parent is removed; children remain", "Nothing, deletion is blocked automatically", "The child layers cascade-delete along with the parent", "Child layers are promoted to become the new parent"], "question": "What happens when you delete a parent base application that has child layers?", "explanation": "Deleting a parent base app cascades and deletes its associated child layers too.", "correctIndex": 2}, {"options": ["Data Rules Designer", "UD Service Designer (SDK)", "Application Map", "BAQ Designer"], "question": "Which tool would you use to create an entirely new user-defined table/service with its own screens?", "explanation": "The UD Service Designer (SDK) is used to create new user-defined services, tables, and deploy full Kinetic screens for them.", "correctIndex": 1}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00
717f3891-d2ca-4054-adfa-2c1d957367de	a94b459e-1681-4785-a669-c5b0971bb572	[{"options": ["Which table has the most columns?", "What should one result row represent?", "Which grid will look best?", "Can I make it updatable?"], "question": "What is the best first question before building a BAQ?", "explanation": "Defining the result grain prevents bad joins and duplicated data later.", "correctIndex": 1}, {"options": ["A Business Activity Query (BAQ) is Epicor's reusable query layer for retrieving and shaping Kinetic data without building a custom SQL application.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “What a BAQ Is and Where It Fits”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Define what one result row represents before adding complexity", "Add as many tables as possible before testing", "Use Cross Company by default", "Make every query updatable"], "question": "Which habit best supports maintainable BAQ development?", "explanation": "The lesson emphasizes defining the result grain and building incrementally.", "correctIndex": 0}, {"options": ["Using clear Query IDs and descriptions", "Testing after each major change", "Using vague names such as Test1 and leaving intent undocumented", "Selecting only required output fields"], "question": "Which approach is most likely to create technical debt?", "explanation": "Clear naming and intent make shared BAQs easier to maintain.", "correctIndex": 2}, {"options": ["Publish it immediately", "Clarify the result grain before adding more logic", "Turn on Updatable", "Add DISTINCT"], "question": "A BAQ returns records, but the developer cannot explain what one row means. What should happen next?", "explanation": "A correct row grain is foundational to joins, aggregation, and downstream use.", "correctIndex": 1}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
305891b0-cacf-4556-8ff8-bb94304cd35e	184874b8-66d2-4692-95d4-bd9512a80800	[{"options": ["On every BAQ", "Only when the query is intentionally expected to return data across companies", "Only for UBAQs", "Only for reports"], "question": "When should Cross Company be enabled?", "explanation": "Cross-company behavior should be deliberate because it changes the data scope.", "correctIndex": 1}, {"options": ["Create a new query, enter a Query ID and Description, then decide whether it should be Shared and whether it needs Cross Company behavior.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Create a BAQ from Scratch”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Define what one result row represents before adding complexity", "Add as many tables as possible before testing", "Use Cross Company by default", "Make every query updatable"], "question": "Which habit best supports maintainable BAQ development?", "explanation": "The lesson emphasizes defining the result grain and building incrementally.", "correctIndex": 0}, {"options": ["Using clear Query IDs and descriptions", "Testing after each major change", "Using vague names such as Test1 and leaving intent undocumented", "Selecting only required output fields"], "question": "Which approach is most likely to create technical debt?", "explanation": "Clear naming and intent make shared BAQs easier to maintain.", "correctIndex": 2}, {"options": ["Publish it immediately", "Clarify the result grain before adding more logic", "Turn on Updatable", "Add DISTINCT"], "question": "A BAQ returns records, but the developer cannot explain what one row means. What should happen next?", "explanation": "A correct row grain is foundational to joins, aggregation, and downstream use.", "correctIndex": 1}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
085e447d-6e22-4fa5-bbe3-c1699d3b53e2	04037f97-5bff-4406-9be4-7fcbe811ac81	[{"options": ["Shared", "Cross Company", "Updatable", "All of them"], "question": "Which flag creates write capability?", "explanation": "Updatable is the setting related to write behavior.", "correctIndex": 2}, {"options": ["Shared controls whether the query is available beyond its creator, subject to security.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Shared, Cross Company, and Updatable Are Different Decisions”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
bf9ee86a-64e1-4af4-8dcf-5dd32df4ff02	881c5ae4-44ab-4860-83f3-8485154d3668	[{"options": ["Nothing", "The result grain can change from detail rows to grouped rows", "The BAQ becomes updatable automatically", "Parameters stop working"], "question": "What changes when you aggregate a BAQ?", "explanation": "Aggregation changes how many source rows are represented by one result row.", "correctIndex": 1}, {"options": ["Functions such as SUM, COUNT, AVG, MIN, and MAX compress multiple source rows into grouped results.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Group and Aggregate Deliberately”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The expression and a compatible result data type", "Only the display label", "Only whether the query is Shared", "Only the company"], "question": "What must be considered when defining a calculated field?", "explanation": "A calculated field needs an expression and a data type that correctly represents the result.", "correctIndex": 0}, {"options": ["Multiple detail rows can become one summarized row", "Nothing changes", "The BAQ automatically becomes updatable", "All joins become outer joins"], "question": "What happens to query grain when rows are grouped and aggregated?", "explanation": "Grouping changes what each result row represents.", "correctIndex": 0}, {"options": ["When it is used to hide unexplained duplicate multiplication", "When unique projected rows are genuinely required", "When reviewing output", "When testing a calculated field"], "question": "When is DISTINCT most questionable?", "explanation": "The lesson warns against using DISTINCT as a repair for incorrect query design.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
a115394f-2b73-47fa-ae97-453e2398dbd3	28c0af68-7290-4eed-afd9-3a42047ec6be	[{"options": ["A BPM Directive", "A Library", "A Widget", "An Event"], "question": "What is the single unit of deployment for one or more Functions?", "explanation": "Functions are created and deployed inside a Library — the single deployment unit.", "correctIndex": 1}, {"options": ["A BPM context variable", "An API Key", "A sliding panel ID", "A DataView filter"], "question": "What must every Kinetic REST API v.2 service method call include?", "explanation": "REST API v.2 requires an API Key to be passed with every service method call.", "correctIndex": 1}, {"options": ["The TransView dataview", "The actionResult system dataview", "A new custom dataview", "They must be manually mapped every time"], "question": "Where do simple (non-tableset) Function response parameters automatically land after an erp-function call?", "explanation": "Simple response parameters populate the actionResult system dataview automatically.", "correctIndex": 1}, {"options": ["A Data Rule with a highlight action", "A BPM post-processing directive checking a call context field", "A hardcoded default in the DataView", "The Function itself sets the flag directly"], "question": "In the Counter Sales walkthrough, what mechanism auto-marks new orders as Counter Sale?", "explanation": "A BPM post-processing directive on GetNewOrderHed checks CallContext.Character01 and sets OrderHed.CounterSale accordingly.", "correctIndex": 1}, {"options": ["Customize Privileges and Dashboard Developer", "Functions Administrator and Functions Developer", "SDK License and API Administrator", "BPM Administrator and Event Developer"], "question": "Which two security groups govern working with Functions?", "explanation": "Functions Administrator can publish/unpublish libraries; Functions Developer can create Widget Functions.", "correctIndex": 1}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00
6d5d00a4-6309-449e-b8fd-628d66821612	c4039084-9d38-4af6-9ef5-7f355dc56164	[{"options": ["To make the query slower", "To isolate the exact change that altered the result", "Because BAQs cannot be saved otherwise", "To enable Shared"], "question": "Why test after each major query change?", "explanation": "Incremental testing makes join and criteria problems much easier to locate.", "correctIndex": 1}, {"options": ["The safest workflow is incremental: define the grain, add one source table, test, add one relationship, test again, then add filters, display fields, calculations, and parameters.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “A Repeatable BAQ Build Checklist”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Define what one result row represents before adding complexity", "Add as many tables as possible before testing", "Use Cross Company by default", "Make every query updatable"], "question": "Which habit best supports maintainable BAQ development?", "explanation": "The lesson emphasizes defining the result grain and building incrementally.", "correctIndex": 0}, {"options": ["Using clear Query IDs and descriptions", "Testing after each major change", "Using vague names such as Test1 and leaving intent undocumented", "Selecting only required output fields"], "question": "Which approach is most likely to create technical debt?", "explanation": "Clear naming and intent make shared BAQs easier to maintain.", "correctIndex": 2}, {"options": ["Publish it immediately", "Clarify the result grain before adding more logic", "Turn on Updatable", "Add DISTINCT"], "question": "A BAQ returns records, but the developer cannot explain what one row means. What should happen next?", "explanation": "A correct row grain is foundational to joins, aggregation, and downstream use.", "correctIndex": 1}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
1ffe8cd6-0c76-4e3d-90a3-de8d2635ba74	d738960f-f4fd-416c-99ff-9ae7e787aaa5	[{"options": ["OrderHed", "OrderDtl", "Customer", "Company"], "question": "If each result row must represent one sales order line, which table is the better starting point?", "explanation": "The driving table should naturally match the required result grain.", "correctIndex": 1}, {"options": ["If one output row should represent an order, OrderHed is a natural driving table.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Choose the Driving Table”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Join cardinality and join fields", "Whether the query is Shared", "The report font", "Whether Cross Company is enabled"], "question": "A new table causes the BAQ row count to jump unexpectedly. What should you check first?", "explanation": "Unexpected row multiplication usually points to grain or relationship issues.", "correctIndex": 0}, {"options": ["When the driving row must remain even if the related record is missing", "Whenever the query is slow", "Whenever duplicates appear", "Only in Updatable BAQs"], "question": "When is a left outer join preferable to an inner join?", "explanation": "A left outer join preserves the driving-side row when no related row exists.", "correctIndex": 0}, {"options": ["Review join keys", "Review the intended result grain", "Aggregate the child data at the proper level", "Add DISTINCT without understanding the duplication"], "question": "Which is the weakest fix for duplicate rows caused by a bad relationship?", "explanation": "DISTINCT can hide a design problem instead of correcting it.", "correctIndex": 3}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
b1a4b711-4f4f-446d-b0b9-33f5ddf41ae6	7967508a-76d8-4322-8182-26fcfd5c3ac5	[{"options": ["Accept it without review", "Verify the actual join fields and business meaning", "Change it to outer join automatically", "Add DISTINCT"], "question": "What should you do after Epicor suggests a table relationship?", "explanation": "Relationship metadata helps, but the developer still owns query correctness.", "correctIndex": 1}, {"options": ["Epicor's query tooling uses metadata and a data dictionary to help connect related tables.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Use Epicor Relationships as a Starting Point”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Join cardinality and join fields", "Whether the query is Shared", "The report font", "Whether Cross Company is enabled"], "question": "A new table causes the BAQ row count to jump unexpectedly. What should you check first?", "explanation": "Unexpected row multiplication usually points to grain or relationship issues.", "correctIndex": 0}, {"options": ["When the driving row must remain even if the related record is missing", "Whenever the query is slow", "Whenever duplicates appear", "Only in Updatable BAQs"], "question": "When is a left outer join preferable to an inner join?", "explanation": "A left outer join preserves the driving-side row when no related row exists.", "correctIndex": 0}, {"options": ["Review join keys", "Review the intended result grain", "Aggregate the child data at the proper level", "Add DISTINCT without understanding the duplication"], "question": "Which is the weakest fix for duplicate rows caused by a bad relationship?", "explanation": "DISTINCT can hide a design problem instead of correcting it.", "correctIndex": 3}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
6f2c89a6-13c9-4db7-a24e-785296ad09f3	9c6526d6-71b8-4fe7-94b0-74d0efb6c125	[{"options": ["Inner join", "Left outer join", "Cross join", "No join"], "question": "Which join keeps the driving row even when the related table has no match?", "explanation": "A left outer join preserves the row from the left/driving side.", "correctIndex": 1}, {"options": ["Use an inner join when the related record must exist for the result to be valid.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Inner Join vs Left Outer Join”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Join cardinality and join fields", "Whether the query is Shared", "The report font", "Whether Cross Company is enabled"], "question": "A new table causes the BAQ row count to jump unexpectedly. What should you check first?", "explanation": "Unexpected row multiplication usually points to grain or relationship issues.", "correctIndex": 0}, {"options": ["When the driving row must remain even if the related record is missing", "Whenever the query is slow", "Whenever duplicates appear", "Only in Updatable BAQs"], "question": "When is a left outer join preferable to an inner join?", "explanation": "A left outer join preserves the driving-side row when no related row exists.", "correctIndex": 0}, {"options": ["Review join keys", "Review the intended result grain", "Aggregate the child data at the proper level", "Add DISTINCT without understanding the duplication"], "question": "Which is the weakest fix for duplicate rows caused by a bad relationship?", "explanation": "DISTINCT can hide a design problem instead of correcting it.", "correctIndex": 3}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
afdf57a9-3b68-4ecc-bcff-afaff3fdd5d3	420e7ef5-9858-430d-b54e-705125ef2ed0	[{"options": ["Static List Combo", "BAQ Combo", "Reusable Combo (SvcPath/ServiceMethod/TableName)", "DataView Combo"], "question": "Which ComboBox setup would you use to list rows from a UD05 table without writing a BAQ?", "explanation": "Reusable Combo binds directly to a service/method/table (e.g., Ice.BO.UD05Svc + GetRows + UD05) without a BAQ.", "correctIndex": 2}, {"options": ["Converts time to decimal hours", "Links the time value to a companion DatePicker's date column", "Rounds the time to the nearest minute", "Adds a Now button"], "question": "What does the TimeStoredAsDateTime property on TimePicker do?", "explanation": "TimeStoredAsDateTime binds the time value to the same column as a paired DatePicker, so editing one preserves the other.", "correctIndex": 1}, {"options": ["CurrencyBox", "GLAccountEditor", "QuantityUOM", "NumericBox"], "question": "Which component is purpose-built for General Ledger account segment entry?", "explanation": "GLAccountEditor understands GL account segment structure out of the box.", "correctIndex": 1}, {"options": ["Add a button, add an event, publish the layer", "Create a dataview for the list source, configure an event to populate it, configure the SelectionList to read from it", "Create a BAQ, add a combo, bind a grid", "Enable FullScreen, add a container, bind columns"], "question": "What are the three setup steps for a SelectionList component?", "explanation": "SelectionList requires a source dataview, a populating event, and the SelectionList's own read configuration.", "correctIndex": 1}, {"options": ["Shape", "Tag", "PictureBox", "RelationshipMap"], "question": "Which component displays a colored status label using the OK/Warning/Stop/Global/None convention?", "explanation": "Tag renders Kinetic's standard colored status pill using that same five-value convention.", "correctIndex": 1}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00
1b7e3901-b820-4fd3-be3c-b2cb4beb0562	9a5392c2-f381-48b5-adc3-d630f11cb8dc	[{"options": ["Connect via FTP", "Install a desktop client", "Download a mobile-only app", "Open your Kinetic URL in a web browser"], "question": "How do you access Kinetic?", "explanation": "Kinetic is a browser-based experience — there's nothing to install locally.", "correctIndex": 3}, {"options": ["It disables Application Studio", "It requires a hardware security key", "It logs you in automatically using your existing corporate credentials", "It requires a separate Epicor-specific password every time"], "question": "What does Single Sign-On (SSO) change about logging in?", "explanation": "SSO uses your existing corporate identity to log you in, without a separate Epicor password.", "correctIndex": 2}, {"options": ["You cannot switch without logging out", "The User Panel on the Home screen", "The browser address bar", "Inside any open program"], "question": "Where do you switch Company or Site after logging in?", "explanation": "Company/Site/Workstation switches happen through the User Panel, generally only from the Home screen.", "correctIndex": 1}, {"options": ["Recent", "Main Menu", "Favorites", "Help & Support"], "question": "Which navigation panel tab shows a running history of recently opened screens?", "explanation": "Recent tracks recently visited screens; Favorites is for manually pinned items.", "correctIndex": 0}, {"options": ["Log out and back in", "Drill through the full Main Menu tree every time", "Ask an administrator to add it to Favorites for you", "Use Enterprise Search and type the screen name"], "question": "What's the fastest way to open a screen if you already know its name?", "explanation": "Enterprise Search is almost always faster than navigating the menu tree manually.", "correctIndex": 3}]	2026-08-12 08:58:28.680761+00	2026-08-12 08:58:28.680761+00
1929871a-fe91-4ed8-bf37-503c9e806950	5ef1ed12-d5c2-41d7-9e0a-4f63ad74bd01	[{"options": ["Add DISTINCT immediately", "Inspect grain, join cardinality, and join criteria", "Make the BAQ updatable", "Remove all filters"], "question": "What is the best first response to unexpected duplicates?", "explanation": "Duplicates often reveal a relationship or grain problem that DISTINCT would only hide.", "correctIndex": 1}, {"options": ["When a header is joined to many detail rows, the header naturally repeats once per detail.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Prevent Duplicate Multiplication”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Join cardinality and join fields", "Whether the query is Shared", "The report font", "Whether Cross Company is enabled"], "question": "A new table causes the BAQ row count to jump unexpectedly. What should you check first?", "explanation": "Unexpected row multiplication usually points to grain or relationship issues.", "correctIndex": 0}, {"options": ["When the driving row must remain even if the related record is missing", "Whenever the query is slow", "Whenever duplicates appear", "Only in Updatable BAQs"], "question": "When is a left outer join preferable to an inner join?", "explanation": "A left outer join preserves the driving-side row when no related row exists.", "correctIndex": 0}, {"options": ["Review join keys", "Review the intended result grain", "Aggregate the child data at the proper level", "Add DISTINCT without understanding the duplication"], "question": "Which is the weakest fix for duplicate rows caused by a bad relationship?", "explanation": "DISTINCT can hide a design problem instead of correcting it.", "correctIndex": 3}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
003e30c2-793f-4d6d-9a1c-ceaca44595a6	716a625b-ea1f-40fb-86fe-77ecd197e0c3	[{"options": ["They reduce unnecessary rows earlier in the query", "They make every field editable", "They replace joins", "They automatically create parameters"], "question": "Why are source-level criteria valuable?", "explanation": "Filtering early usually improves both clarity and efficiency.", "correctIndex": 0}, {"options": ["Table criteria restrict which rows from a table participate in the query.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Add Table Criteria”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
9e1be178-fd94-4e8c-b028-7c0305fdf3c2	ca19a300-4907-453d-9c0b-7afb2114309c	[{"options": ["Add criteria until the row count looks right", "Write the intended logic first and preserve its grouping", "Use only OR", "Use only constants"], "question": "What is the safest way to build complicated AND/OR filters?", "explanation": "Correct Boolean grouping should come from the business rule, not trial and error.", "correctIndex": 1}, {"options": ["A filter such as `OpenOrder = true AND (Customer = A OR Customer = B)` is not equivalent to `(OpenOrder = true AND Customer = A) OR Customer = B`.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “AND, OR, and Grouping Logic”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
6a301038-7580-47ea-8403-8f4cc0d8781f	761f8121-a9da-4cc4-bb9f-9a5a83eec3ad	[{"options": ["When the value should change for each execution", "When the rule can never change", "Only for reports", "Only for UBAQs"], "question": "When is a BAQ parameter preferable to a constant?", "explanation": "Parameters are designed for values supplied by the user or caller at runtime.", "correctIndex": 0}, {"options": ["Epicor describes BAQs as supporting parameter-driven queries.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Create and Use BAQ Parameters”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
481cfe3f-8c1b-4edf-8f2f-2adc76eae402	e364ce34-d5bc-4915-b872-50963956fb61	[{"options": ["Comma-separated in one value only", "Repeat the same parameter name for each value", "Use SQL IN text", "Use a cookie"], "question": "How does the Epicor REST guide show multiple values for a value-list BAQ parameter?", "explanation": "The guide shows the parameter name repeated for each list value.", "correctIndex": 1}, {"options": ["The supplied Epicor REST Services guide documents two important behaviors: date parameters use ISO-style values such as `2026-08-12`, and a value-list parameter can be passed mu...", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Value Lists and Date Parameters”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
e33f60b2-5cff-4716-807e-6c3848e8ea01	2743303f-8b90-44cb-b5ee-04d09b2fe6b0	[{"options": ["BAQ parameters and OData $filter are identical", "A BAQ can have its own parameters and REST can also apply $filter", "OData $filter makes BAQ criteria unnecessary", "Parameters only work in Classic"], "question": "Which statement is correct?", "explanation": "Epicor supports BAQ parameters and OData filtering as separate mechanisms.", "correctIndex": 1}, {"options": ["A BAQ parameter is part of the BAQ's own query contract.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Runtime Filters vs BAQ Parameters”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
2773ae8f-9f42-4232-b33e-0bff21a7e097	eccee75e-0324-4213-85db-eeaadea68fcf	[{"options": ["Epicor forbids it", "A focused output is easier to understand and consume", "It prevents parameters", "It makes joins impossible"], "question": "Why avoid returning every column?", "explanation": "The display field list should behave like a deliberate data contract.", "correctIndex": 1}, {"options": ["Display fields become the columns consumers see.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Select Only Useful Display Fields”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Define what one result row represents before adding complexity", "Add as many tables as possible before testing", "Use Cross Company by default", "Make every query updatable"], "question": "Which habit best supports maintainable BAQ development?", "explanation": "The lesson emphasizes defining the result grain and building incrementally.", "correctIndex": 0}, {"options": ["Using clear Query IDs and descriptions", "Testing after each major change", "Using vague names such as Test1 and leaving intent undocumented", "Selecting only required output fields"], "question": "Which approach is most likely to create technical debt?", "explanation": "Clear naming and intent make shared BAQs easier to maintain.", "correctIndex": 2}, {"options": ["Publish it immediately", "Clarify the result grain before adding more logic", "Turn on Updatable", "Add DISTINCT"], "question": "A BAQ returns records, but the developer cannot explain what one row means. What should happen next?", "explanation": "A correct row grain is foundational to joins, aggregation, and downstream use.", "correctIndex": 1}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
aa84d3d4-6b21-4796-a6c0-aef3a9bf3ad4	1fe98eca-b33a-40af-ba9d-9af7cdeef13b	[{"options": ["A data type compatible with the expression", "Cross Company must be on", "The query must be updatable", "A REST API key"], "question": "Which property is essential when defining a calculated field?", "explanation": "The calculated field needs a data type that correctly represents its expression result.", "correctIndex": 0}, {"options": ["Calculated fields let the BAQ return values that are not stored directly as one database column.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Create Calculated Fields”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The expression and a compatible result data type", "Only the display label", "Only whether the query is Shared", "Only the company"], "question": "What must be considered when defining a calculated field?", "explanation": "A calculated field needs an expression and a data type that correctly represents the result.", "correctIndex": 0}, {"options": ["Multiple detail rows can become one summarized row", "Nothing changes", "The BAQ automatically becomes updatable", "All joins become outer joins"], "question": "What happens to query grain when rows are grouped and aggregated?", "explanation": "Grouping changes what each result row represents.", "correctIndex": 0}, {"options": ["When it is used to hide unexplained duplicate multiplication", "When unique projected rows are genuinely required", "When reviewing output", "When testing a calculated field"], "question": "When is DISTINCT most questionable?", "explanation": "The lesson warns against using DISTINCT as a repair for incorrect query design.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
d2dcf61f-d29e-4ae1-a6ee-9d6c3f94a621	c4bad615-d18b-4e9d-9831-d8dc5bd8b662	[{"options": ["When used after a known join explosion to hide duplicates", "When the business output genuinely requires unique projected rows", "When testing a query", "When selecting keys"], "question": "When is DISTINCT suspicious?", "explanation": "DISTINCT should not be used to conceal incorrect relationships.", "correctIndex": 0}, {"options": ["DISTINCT can be valid when identical projected rows are genuinely duplicates for the requested output.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “DISTINCT Is a Tool, Not a Repair Strategy”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The expression and a compatible result data type", "Only the display label", "Only whether the query is Shared", "Only the company"], "question": "What must be considered when defining a calculated field?", "explanation": "A calculated field needs an expression and a data type that correctly represents the result.", "correctIndex": 0}, {"options": ["Multiple detail rows can become one summarized row", "Nothing changes", "The BAQ automatically becomes updatable", "All joins become outer joins"], "question": "What happens to query grain when rows are grouped and aggregated?", "explanation": "Grouping changes what each result row represents.", "correctIndex": 0}, {"options": ["When it is used to hide unexplained duplicate multiplication", "When unique projected rows are genuinely required", "When reviewing output", "When testing a calculated field"], "question": "When is DISTINCT most questionable?", "explanation": "The lesson warns against using DISTINCT as a repair for incorrect query design.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
dcc3d3c0-b64a-4893-b3f9-381dd32e562d	ada92e7d-4f4d-40d9-afc5-f274d08854d5	[{"options": ["It is always updatable", "It represents the final query layer returned to the consumer", "It can contain no tables", "It only stores parameters"], "question": "What is the role of the top-level subquery?", "explanation": "The top-level subquery produces the result consumed outside the BAQ.", "correctIndex": 1}, {"options": ["The top-level subquery is the final layer returned to the consumer, while inner or supporting subqueries can prepare data before it reaches that final output.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Understand the Top-Level Subquery”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["To keep the summarized value at the correct grain", "To make the query Shared", "To remove the need for keys", "To enable Cross Company"], "question": "Why use an aggregate subquery before joining totals back to detail rows?", "explanation": "Pre-aggregation helps prevent header-level or summary values from multiplying across detail rows.", "correctIndex": 0}, {"options": ["That the branches represent compatible columns and business meaning", "That both branches are updatable", "That both use the same table", "That DISTINCT is enabled"], "question": "What should a developer verify before combining result branches with a union-style design?", "explanation": "Union-style designs require compatible output meaning and data types.", "correctIndex": 0}, {"options": ["As a starting point that still requires validation", "As automatically correct", "As exempt from testing", "As always read-only"], "question": "How should generated or advanced query structures be treated?", "explanation": "Generated or advanced BAQs still require business and performance validation.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
3035b596-57c2-4c1d-ae28-b2221f2bbcfe	6438e3a2-d8a1-411e-ac0d-ea1f6ece49b7	[{"options": ["To create more duplicates", "To reduce it to the grain required by the parent query", "To make Cross Company work", "To enable REST"], "question": "Why aggregate a one-to-many table before joining it back?", "explanation": "Pre-aggregation can preserve the intended grain and avoid duplicated totals.", "correctIndex": 1}, {"options": ["If a shipment has many detail lines but you need one shipment-level freight total, calculate the total in a subquery grouped by the shipment key, then join that single summarize...", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Use an Aggregate Subquery to Prevent Multiplication”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The expression and a compatible result data type", "Only the display label", "Only whether the query is Shared", "Only the company"], "question": "What must be considered when defining a calculated field?", "explanation": "A calculated field needs an expression and a data type that correctly represents the result.", "correctIndex": 0}, {"options": ["Multiple detail rows can become one summarized row", "Nothing changes", "The BAQ automatically becomes updatable", "All joins become outer joins"], "question": "What happens to query grain when rows are grouped and aggregated?", "explanation": "Grouping changes what each result row represents.", "correctIndex": 0}, {"options": ["When it is used to hide unexplained duplicate multiplication", "When unique projected rows are genuinely required", "When reviewing output", "When testing a calculated field"], "question": "When is DISTINCT most questionable?", "explanation": "The lesson warns against using DISTINCT as a repair for incorrect query design.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
9ef1043f-1d57-44aa-8985-1b8d36a73f1a	f215c676-6897-495d-81fa-2fffcc6f60c7	[{"options": ["When two branches return compatible rows for the same conceptual output", "Whenever a join is difficult", "Only for UBAQs", "Only for cross-company queries"], "question": "When is a union-style design appropriate?", "explanation": "Union-style queries are for vertically combining compatible result sets.", "correctIndex": 0}, {"options": ["Union-style subqueries combine rows from separate query branches that expose compatible columns.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Union and Union-All Concepts”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["To keep the summarized value at the correct grain", "To make the query Shared", "To remove the need for keys", "To enable Cross Company"], "question": "Why use an aggregate subquery before joining totals back to detail rows?", "explanation": "Pre-aggregation helps prevent header-level or summary values from multiplying across detail rows.", "correctIndex": 0}, {"options": ["That the branches represent compatible columns and business meaning", "That both branches are updatable", "That both use the same table", "That DISTINCT is enabled"], "question": "What should a developer verify before combining result branches with a union-style design?", "explanation": "Union-style designs require compatible output meaning and data types.", "correctIndex": 0}, {"options": ["As a starting point that still requires validation", "As automatically correct", "As exempt from testing", "As always read-only"], "question": "How should generated or advanced query structures be treated?", "explanation": "Generated or advanced BAQs still require business and performance validation.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
29910895-1c06-4c8b-b3e7-08441f0a5522	66089ca1-bec8-4015-9952-041a0ecaa6d6	[{"options": ["As automatically correct", "As a starting point that still requires review and testing", "As read-only forever", "As unsupported"], "question": "How should generated BAQs be treated?", "explanation": "Generated query structures still need business and performance validation.", "correctIndex": 1}, {"options": ["Epicor's current BAQ product information highlights recursive queries for hierarchical relationships and nested calculations for advanced data shaping.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Recursive Queries and SQL-to-BAQ Generator”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["To keep the summarized value at the correct grain", "To make the query Shared", "To remove the need for keys", "To enable Cross Company"], "question": "Why use an aggregate subquery before joining totals back to detail rows?", "explanation": "Pre-aggregation helps prevent header-level or summary values from multiplying across detail rows.", "correctIndex": 0}, {"options": ["That the branches represent compatible columns and business meaning", "That both branches are updatable", "That both use the same table", "That DISTINCT is enabled"], "question": "What should a developer verify before combining result branches with a union-style design?", "explanation": "Union-style designs require compatible output meaning and data types.", "correctIndex": 0}, {"options": ["As a starting point that still requires validation", "As automatically correct", "As exempt from testing", "As always read-only"], "question": "How should generated or advanced query structures be treated?", "explanation": "Generated or advanced BAQs still require business and performance validation.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
90b96ea1-f4a2-4157-a160-5750eaa4a99c	3b1ff270-1a20-4ee7-bc19-1c428b06a753	[{"options": ["Only that the query returns something", "It helps validate syntax and actual business results", "That the BAQ is secure", "That it can update data"], "question": "What does a successful Analyze/Get List test prove?", "explanation": "Testing must include the actual returned data, not just compilation.", "correctIndex": 1}, {"options": ["A syntactically valid BAQ can still be logically wrong.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Analyze and Get List”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Verify actual returned records, row counts, nulls, and duplicates", "Assume the data is correct because syntax passed", "Enable Updatable", "Rename every field"], "question": "Which test is most important after a BAQ successfully analyzes?", "explanation": "Syntax success does not prove business correctness.", "correctIndex": 0}, {"options": ["A field or filter change can break dependent UIs, reports, or integrations", "It automatically improves performance", "It replaces security", "It is required only for Cross Company"], "question": "Why should BAQ consumers be documented?", "explanation": "BAQs often become shared interfaces with downstream dependencies.", "correctIndex": 0}, {"options": ["Use the smallest scope and permissions required", "Share everything with everyone", "Always enable Cross Company", "Always enable Updatable"], "question": "What is the safest default for production BAQ access?", "explanation": "Least privilege and deliberate scope reduce unnecessary exposure.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
9d133ace-a5de-4393-9423-e85b18101f94	8b1816e3-e0e6-4b74-9b85-dd0556abe0b3	[{"options": ["To rename the BAQ", "To limit access to permitted users/groups", "To add parameters", "To improve joins"], "question": "What is the purpose of a Security ID on a custom BAQ?", "explanation": "Security IDs are used to control who can access the query data.", "correctIndex": 1}, {"options": ["Epicor's official training material shows that a custom BAQ can be assigned a Security ID, and only users with access through that security configuration can display the query's...", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Security IDs and Query Access”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Verify actual returned records, row counts, nulls, and duplicates", "Assume the data is correct because syntax passed", "Enable Updatable", "Rename every field"], "question": "Which test is most important after a BAQ successfully analyzes?", "explanation": "Syntax success does not prove business correctness.", "correctIndex": 0}, {"options": ["A field or filter change can break dependent UIs, reports, or integrations", "It automatically improves performance", "It replaces security", "It is required only for Cross Company"], "question": "Why should BAQ consumers be documented?", "explanation": "BAQs often become shared interfaces with downstream dependencies.", "correctIndex": 0}, {"options": ["Use the smallest scope and permissions required", "Share everything with everyone", "Always enable Cross Company", "Always enable Updatable"], "question": "What is the safest default for production BAQ access?", "explanation": "Least privilege and deliberate scope reduce unnecessary exposure.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
b22e6e62-7eee-4ccf-b8be-5c50d841ce44	031f64f5-63fa-405e-b09a-a892d4aa52ec	[{"options": ["Add more display fields", "Apply selective criteria earlier", "Make it updatable", "Enable Cross Company"], "question": "Which change is most likely to help a BAQ that retrieves far more rows than necessary?", "explanation": "Reducing unnecessary source rows is a core performance technique.", "correctIndex": 1}, {"options": ["Performance is strongly affected by how many rows are scanned, how tables are joined, and whether filters use meaningful indexed fields.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Performance Starts with Query Shape”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Verify actual returned records, row counts, nulls, and duplicates", "Assume the data is correct because syntax passed", "Enable Updatable", "Rename every field"], "question": "Which test is most important after a BAQ successfully analyzes?", "explanation": "Syntax success does not prove business correctness.", "correctIndex": 0}, {"options": ["A field or filter change can break dependent UIs, reports, or integrations", "It automatically improves performance", "It replaces security", "It is required only for Cross Company"], "question": "Why should BAQ consumers be documented?", "explanation": "BAQs often become shared interfaces with downstream dependencies.", "correctIndex": 0}, {"options": ["Use the smallest scope and permissions required", "Share everything with everyone", "Always enable Cross Company", "Always enable Updatable"], "question": "What is the safest default for production BAQ access?", "explanation": "Least privilege and deliberate scope reduce unnecessary exposure.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
eeba1340-23fe-4ad7-a3af-44c4a86fb9c3	31c553d1-cdc0-44df-bc78-2b600b35b066	[{"options": ["Because BAQ changes can break dependent screens, reports, and integrations", "Because Shared requires it", "Because parameters cannot be renamed", "Only for licensing"], "question": "Why track BAQ consumers?", "explanation": "A BAQ often becomes a shared interface used by multiple downstream components.", "correctIndex": 0}, {"options": ["Confirm naming, description, company scope, security, parameters, expected row grain, edge cases, performance, and consumers.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Safe Promotion Checklist”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Verify actual returned records, row counts, nulls, and duplicates", "Assume the data is correct because syntax passed", "Enable Updatable", "Rename every field"], "question": "Which test is most important after a BAQ successfully analyzes?", "explanation": "Syntax success does not prove business correctness.", "correctIndex": 0}, {"options": ["A field or filter change can break dependent UIs, reports, or integrations", "It automatically improves performance", "It replaces security", "It is required only for Cross Company"], "question": "Why should BAQ consumers be documented?", "explanation": "BAQs often become shared interfaces with downstream dependencies.", "correctIndex": 0}, {"options": ["Use the smallest scope and permissions required", "Share everything with everyone", "Always enable Cross Company", "Always enable Updatable"], "question": "What is the safest default for production BAQ access?", "explanation": "Least privilege and deliberate scope reduce unnecessary exposure.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
b0a5d01d-bf94-4c8a-8ecb-72111b0f10a9	4e55a547-3b14-41f3-8990-03d8b79ccc79	[{"options": ["Put every business filter in JavaScript", "Keep reusable data logic in the BAQ and screen context in the UI layer", "Never use DataViews", "Use only REST"], "question": "What is a good separation of responsibility?", "explanation": "This separation makes both the BAQ and the UI easier to maintain.", "correctIndex": 1}, {"options": ["Epicor Application Studio can integrate BAQ data directly into user interfaces.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Create a BAQ-Backed DataView”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
90a44e25-0ab9-4e5e-9309-dc84fbd1ef82	3b47c77a-6a97-4e38-b268-98d2dae1d445	[{"options": ["The BAQ Display Fields", "The browser cache", "The menu security code", "The BPM only"], "question": "Where do the grid's BAQ-backed columns originate?", "explanation": "The DataView exposes the fields returned by the BAQ.", "correctIndex": 0}, {"options": ["Once the BAQ-backed DataView is configured, bind grid columns to the fields returned by the BAQ.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Populate a Grid with BAQ Results”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
dc780071-e981-4ee7-aa3d-417e1dcfc8ce	3bbc10f9-9fee-4087-bfd2-ba1825470cd1	[{"options": ["It is based on current runtime values from the consuming screen", "It has no criteria", "It uses Cross Company", "It must be a UBAQ"], "question": "What makes a dynamic BAQ filter dynamic?", "explanation": "Dynamic filters are constructed from values available at runtime.", "correctIndex": 0}, {"options": ["The supplied Kinetic training documents demonstrate BAQ DataView filters built from current screen values.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Dynamic BAQ Filters from Screen Values”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
9f8b84a2-7872-4484-b05c-0349e3ef76a0	ad358263-3386-44d9-b54e-761593d3c71d	[{"options": ["The child keeps old rows", "The child filter/refresh should follow the new parent key", "The BAQ becomes cross-company", "Nothing"], "question": "What should happen when the parent record changes?", "explanation": "Child data must stay synchronized with the active parent context.", "correctIndex": 1}, {"options": ["A common pattern is a parent view that establishes context and a child BAQ DataView filtered by the current parent's key.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Parent-Child BAQ DataViews”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
6fd72183-d6fb-409e-83e8-a5c7f0a194d7	b6a2032d-5fd7-42a3-b1d1-ce90565210d6	[{"options": ["In every grid separately", "In the BAQ itself", "Only in CSS", "In the browser URL"], "question": "Where should a universal 'only active records' rule usually live?", "explanation": "Reusable business data rules should generally live with the reusable query.", "correctIndex": 1}, {"options": ["A BAQ can already contain fixed criteria and parameters, while the DataView can add runtime filters.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Avoid Double Filtering Confusion”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
48f8a62f-b368-41b8-a90a-091fbb96b3c0	52dc5de2-98c8-4fb1-b69c-eda8eecb182c	[{"options": ["Only a pretty label", "A stable value plus a useful display value", "Every field in the table", "Only calculated fields"], "question": "What should a BAQ combo return?", "explanation": "The UI needs a stored value and a user-friendly representation.", "correctIndex": 1}, {"options": ["A BAQ-backed combo is useful when the option list depends on ERP data, multiple fields, custom calculations, or filters that a static list cannot express.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Populate a Combo from a BAQ”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Reusable data logic in the BAQ; screen-specific interaction/context in the UI", "All query logic in JavaScript", "All UI behavior inside the BAQ", "No separation is needed"], "question": "What is the best separation between a BAQ and an App Studio layer?", "explanation": "Separating reusable data logic from screen behavior improves maintainability.", "correctIndex": 0}, {"options": ["After the required parent/context key is available or changes", "Continuously every second", "Only when the application closes", "Before any parent value exists"], "question": "When should a BAQ-backed child view refresh?", "explanation": "Child BAQ data must stay synchronized with the current parent context.", "correctIndex": 0}, {"options": ["One user action triggers the same BAQ several unnecessary times", "The BAQ runs after all required values are available", "The grid binds only required fields", "The combo refreshes when its dependency changes"], "question": "What is a sign that an App Studio BAQ event design needs review?", "explanation": "Repeated unnecessary execution can hurt performance and indicates an event-chain problem.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
08563992-1197-494e-85fe-39568a379ccb	4e8e25fe-27fd-4db1-824b-893404ecefd3	[{"options": ["Keep the old option list forever", "Refresh the options and revalidate the selected value", "Turn on Cross Company", "Delete the BAQ"], "question": "What should happen when a combo dependency changes?", "explanation": "Dependent option lists must stay aligned with their runtime context.", "correctIndex": 1}, {"options": ["The supplied training documents show filterable BAQ combos where values from the current screen are injected into the BAQ filter.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Filter a Combo with Current Values”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
03af717e-998b-41b1-853c-77a11acd8808	b16334c3-dc94-407e-9b1f-79364089bf78	[{"options": ["To progressively narrow choices using prior selections", "To avoid BAQs", "To make every query updatable", "To replace security"], "question": "Why use cascading combos?", "explanation": "Cascading combos keep choices relevant to the current context.", "correctIndex": 0}, {"options": ["A cascading design might be Customer → Order → Line.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Build Cascading BAQ Combos”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Reusable data logic in the BAQ; screen-specific interaction/context in the UI", "All query logic in JavaScript", "All UI behavior inside the BAQ", "No separation is needed"], "question": "What is the best separation between a BAQ and an App Studio layer?", "explanation": "Separating reusable data logic from screen behavior improves maintainability.", "correctIndex": 0}, {"options": ["After the required parent/context key is available or changes", "Continuously every second", "Only when the application closes", "Before any parent value exists"], "question": "When should a BAQ-backed child view refresh?", "explanation": "Child BAQ data must stay synchronized with the current parent context.", "correctIndex": 0}, {"options": ["One user action triggers the same BAQ several unnecessary times", "The BAQ runs after all required values are available", "The grid binds only required fields", "The combo refreshes when its dependency changes"], "question": "What is a sign that an App Studio BAQ event design needs review?", "explanation": "Repeated unnecessary execution can hurt performance and indicates an event-chain problem.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
6cf2ef64-d573-4c41-98f3-2feb94feabf2	1d4b2ba4-8bbd-419d-9e03-971124e441ac	[{"options": ["Every available event", "The event that occurs when all required context is ready", "A timer every second", "Only form load"], "question": "What is the best trigger for a BAQ?", "explanation": "Run the BAQ when its required inputs are available and the result is actually needed.", "correctIndex": 1}, {"options": ["In App Studio, BAQ execution can be triggered from configured events.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Use erp-baq Events Intentionally”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Reusable data logic in the BAQ; screen-specific interaction/context in the UI", "All query logic in JavaScript", "All UI behavior inside the BAQ", "No separation is needed"], "question": "What is the best separation between a BAQ and an App Studio layer?", "explanation": "Separating reusable data logic from screen behavior improves maintainability.", "correctIndex": 0}, {"options": ["After the required parent/context key is available or changes", "Continuously every second", "Only when the application closes", "Before any parent value exists"], "question": "When should a BAQ-backed child view refresh?", "explanation": "Child BAQ data must stay synchronized with the current parent context.", "correctIndex": 0}, {"options": ["One user action triggers the same BAQ several unnecessary times", "The BAQ runs after all required values are available", "The grid binds only required fields", "The combo refreshes when its dependency changes"], "question": "What is a sign that an App Studio BAQ event design needs review?", "explanation": "Repeated unnecessary execution can hurt performance and indicates an event-chain problem.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
e8e44c4c-df3f-47ea-adff-1bbf0a313fd6	3ac4d60c-1fcb-4053-991b-61eb0982b61b	[{"options": ["Only the grid color", "It can become a write surface against live ERP data", "Parameters are disabled", "It becomes a report"], "question": "What changes when a BAQ becomes updatable?", "explanation": "UBAQs must be treated as controlled write interfaces.", "correctIndex": 1}, {"options": ["Epicor states that Updatable BAQs can make real-time changes to live data.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “When a BAQ Should Be Updatable”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
93457385-1ad9-4cb9-adb9-a402a0825c16	1bc7e32e-3d2e-42e8-8319-c9372c0328f3	[{"options": ["Every display field", "Only fields intentionally editable for the workflow", "Only keys", "Only descriptions"], "question": "Which fields should be marked updatable?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 1}, {"options": ["The BPM Cookbook's UBAQ example starts by enabling Updatable, then configures Update properties and identifies which fields are editable.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Enable Updatable and Choose Editable Fields”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
ad5edf65-cf22-4f02-989c-7d775fe7033e	1c27f439-2db4-47ad-b470-0ee0ed456273	[{"options": ["Yes", "No, only when the process safely supports multi-row transactions", "Only for reports", "Only for REST"], "question": "Should Allow Multiple Row Update always be enabled?", "explanation": "Multi-row updates need deliberate transaction and error behavior.", "correctIndex": 1}, {"options": ["The supplied BPM Cookbook demonstrates settings such as Allow Multiple Row Update and Allow New Record.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Allow New Record and Multiple Row Update”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
36db73c2-c3b7-4a57-8f26-2a548232a484	0e231d7c-ccaf-4b3e-8fc1-2f9792e33d64	[{"options": ["When custom validation or business-object orchestration is required", "For every editable BAQ", "Only to rename fields", "To add display columns"], "question": "When is advanced BPM update processing justified?", "explanation": "Custom processing is useful when the update represents more than a direct mapped field change.", "correctIndex": 0}, {"options": ["Straightforward field updates may be handled through standard UBAQ update mapping.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Direct Update vs BPM Update Processing”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
d3e278c0-dcc3-424c-a3a8-86831a2545ed	d4dc1947-240f-4e8c-9365-a2e333fe517b	[{"options": ["To store the checkbox permanently", "To capture an action/selection that BPM logic can process", "To replace all table fields", "To improve SQL indexing"], "question": "Why use an updatable calculated checkbox in a UBAQ?", "explanation": "Calculated intent fields can separate the user's requested action from direct database editing.", "correctIndex": 1}, {"options": ["The BPM Cookbook uses a calculated bit field such as DeleteRecord to capture user intent.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Calculated Fields as User Intent”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
5c1828d5-363f-42ff-a393-a8d366c4c4d6	3c9f621d-ece4-4b17-a2bd-b8f09dc3285f	[{"options": ["To bypass Epicor logic", "To preserve supported business update behavior", "To remove RowMod", "To make the BAQ shared"], "question": "Why call an Epicor business object from UBAQ BPM processing?", "explanation": "Business objects are used to execute the ERP's update logic rather than raw table changes.", "correctIndex": 1}, {"options": ["For advanced processing, configure the UBAQ's Update method and create a Base Processing directive.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Base Processing Directive Pattern”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
4caa51a4-5286-4032-99da-4cb7651bdef8	0abdff2a-952b-4ea5-8e2f-5587d0a53070	[{"options": ["It helps identify which rows participate in the update", "It controls BAQ security", "It defines the join type", "It enables REST help"], "question": "Why is row state important in a UBAQ update?", "explanation": "Update processing needs to know which rows were actually modified.", "correctIndex": 0}, {"options": ["Updatable datasets use row state/RowMod behavior to identify changed rows.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Changed Rows, RowMod, and Selection”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
73d9332a-de27-4577-bf30-bb7b5337e7e1	b1aecef4-801e-4e12-bac0-1ce7b269d727	[{"options": ["To let the user see which specific record failed", "To enable Cross Company", "To remove duplicates", "To create parameters"], "question": "Why map errors back by row identity?", "explanation": "Row-specific feedback makes multi-row update failures actionable.", "correctIndex": 0}, {"options": ["The BPM Cookbook example maps business-object errors back to the originating query row using identifiers such as SysRowID and exposes the text through a calculated error field.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Return Errors to the Correct Row”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
4e61cc34-ca83-489d-839e-bf3d70ff0643	de1d155d-7626-4fe5-b8c7-8e848f3b8cf2	[{"options": ["The UI framework automatically", "The business requirement, implemented consistently in update logic", "The first developer available", "The REST client"], "question": "Who should decide whether partial success is acceptable?", "explanation": "Rollback behavior should reflect the intended business transaction.", "correctIndex": 1}, {"options": ["For multi-row processing, define whether one bad row should stop everything or whether valid rows may succeed while failed rows return errors.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Transaction and Rollback Thinking”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
d3756a22-54f9-42f9-a201-42ae402aed1a	263e84bc-a69e-493a-af77-5d465adadefa	[{"options": ["The BAQ dataset", "The menu icon", "The browser theme", "The user's favorites"], "question": "What should be validated before report formatting?", "explanation": "A correct dataset is the foundation of a correct report.", "correctIndex": 0}, {"options": ["A BAQ Report uses BAQ data as the reporting dataset and can then be presented through a report definition/layout.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Understand the BAQ Report Pipeline”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The BAQ dataset and filtering behavior", "Only the report font", "Only the menu icon", "Only the user theme"], "question": "What should be correct before spending time on BAQ Report layout?", "explanation": "Report formatting should sit on top of a validated dataset.", "correctIndex": 0}, {"options": ["The producer and consumer must interpret multiple values consistently", "It enables Cross Company", "It replaces query security", "It makes fields editable"], "question": "Why must multi-select delimiter handling be defined clearly?", "explanation": "Multi-select values require a consistent serialization and parsing contract.", "correctIndex": 0}, {"options": ["Confusing or contradictory behavior", "Automatic performance improvement", "Automatic security", "No risk at all"], "question": "What is a risk of duplicating the same report filter in multiple layers?", "explanation": "Duplicated filtering logic is harder to reason about and maintain.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
46528751-da02-4206-b39f-72f9acae2961	3ff2eabc-9646-4f27-972a-b53872217c5c	[{"options": ["Confusing or contradictory behavior", "Better security automatically", "Faster reports always", "No risk"], "question": "What is the risk of duplicating the same filter in several layers?", "explanation": "Duplicated filter logic becomes difficult to reason about and maintain.", "correctIndex": 0}, {"options": ["A report can collect user selections while the underlying BAQ also has criteria or parameters.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Report Parameters and BAQ Filters”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
1a638521-3387-46b1-93ea-298af9b14782	0091ae73-c0c0-4f6d-bbf2-1c46630cfb55	[{"options": ["So producer and consumer interpret the list consistently", "To enable Cross Company", "To make fields updatable", "To create joins"], "question": "Why document the delimiter for multi-select values?", "explanation": "Multi-value strings require an agreed serialization format.", "correctIndex": 0}, {"options": ["The supplied training material includes BAQ Report work involving multi-select values and delimiter handling.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Multi-Select Values and Delimiters”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The BAQ dataset and filtering behavior", "Only the report font", "Only the menu icon", "Only the user theme"], "question": "What should be correct before spending time on BAQ Report layout?", "explanation": "Report formatting should sit on top of a validated dataset.", "correctIndex": 0}, {"options": ["The producer and consumer must interpret multiple values consistently", "It enables Cross Company", "It replaces query security", "It makes fields editable"], "question": "Why must multi-select delimiter handling be defined clearly?", "explanation": "Multi-select values require a consistent serialization and parsing contract.", "correctIndex": 0}, {"options": ["Confusing or contradictory behavior", "Automatic performance improvement", "Automatic security", "No risk at all"], "question": "What is a risk of duplicating the same report filter in multiple layers?", "explanation": "Duplicated filtering logic is harder to reason about and maintain.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
834ed233-7125-43a0-9538-77c77a7fa09d	ca051a28-8764-4aec-bf48-0e3bc689baa8	[{"options": ["Through menu configuration", "Only SQL Server", "Only REST Help", "Only the BAQ Analyze tab"], "question": "Where can a deployed Kinetic BAQ report be surfaced?", "explanation": "Epicor provides menu deployment for Kinetic BAQ reports.", "correctIndex": 0}, {"options": ["Epicor's official Kinetic video library shows BAQ reports can be previewed/deployed as Kinetic applications and added to the menu through Menu Maintenance.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Deploy BAQ Reports in Kinetic”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The BAQ dataset and filtering behavior", "Only the report font", "Only the menu icon", "Only the user theme"], "question": "What should be correct before spending time on BAQ Report layout?", "explanation": "Report formatting should sit on top of a validated dataset.", "correctIndex": 0}, {"options": ["The producer and consumer must interpret multiple values consistently", "It enables Cross Company", "It replaces query security", "It makes fields editable"], "question": "Why must multi-select delimiter handling be defined clearly?", "explanation": "Multi-select values require a consistent serialization and parsing contract.", "correctIndex": 0}, {"options": ["Confusing or contradictory behavior", "Automatic performance improvement", "Automatic security", "No risk at all"], "question": "What is a risk of duplicating the same report filter in multiple layers?", "explanation": "Duplicated filtering logic is harder to reason about and maintain.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
07d37024-937b-4b24-9a63-41608c8f9440	7da4ecde-e81e-4c76-b303-2725967e571f	[{"options": ["External consumers can depend on its fields and parameters", "Because it cannot be edited", "Because it is always updatable", "Because it has no security"], "question": "Why treat a REST-exposed BAQ like an API contract?", "explanation": "Changes to a BAQ can break integrations that consume its schema.", "correctIndex": 0}, {"options": ["Epicor REST Services exposes BAQ data through BAQ service endpoints.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “BAQ REST Endpoint Concept”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["External consumers may depend on field names, types, and parameters", "REST automatically makes it immutable", "It no longer needs testing", "It ignores BAQ security"], "question": "Why should a REST-exposed BAQ be treated like an API contract?", "explanation": "Changes to a BAQ schema can break consuming integrations.", "correctIndex": 0}, {"options": ["They are separate filtering mechanisms that can both be used", "They are exactly the same thing", "$filter automatically creates BAQ parameters", "Parameters work only for UBAQs"], "question": "What is the relationship between BAQ parameters and OData $filter?", "explanation": "The course distinguishes the BAQ's own parameters from REST-side OData filtering.", "correctIndex": 0}, {"options": ["Authentication, permissions, validation, allowed fields, and error behavior", "Only the BAQ description", "Only the browser theme", "Only the report layout"], "question": "What deserves extra review before exposing a UBAQ through REST?", "explanation": "Write-capable endpoints require tighter controls than read-only queries.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
c312ea01-ca8c-41d8-98dd-38486b1c479c	425be235-faa9-42f0-8f09-37550a266905	[{"options": ["In the query string", "Only in cookies", "In SQL text", "In the menu"], "question": "Where are BAQ custom parameter values supplied in the REST example?", "explanation": "The guide shows custom BAQ parameters supplied as query-string values.", "correctIndex": 0}, {"options": ["The supplied Epicor REST Services guide documents executing a BAQ with custom parameters appended to the BAQ Data endpoint.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Pass BAQ Parameters through REST”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
1dccf3b0-86d2-46ed-ae31-1791f8079ece	99016a0d-e7d5-458b-b86a-4175109d5b20	[{"options": ["A universal security/business restriction", "A temporary UI preference", "A caller-specific narrowing filter", "A search term"], "question": "What should not be delegated only to a client-side $filter?", "explanation": "Critical restrictions belong in controlled server-side logic, not only client filters.", "correctIndex": 0}, {"options": ["Epicor's REST guide also documents applying OData $filter to BAQ results.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Use OData $filter on BAQ Results”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
6269f52a-d630-4393-8c73-25cf306c75ea	73e59bca-83cf-4627-95e5-6171c7779231	[{"options": ["Permissions, validation, allowed fields, and error behavior", "Only the BAQ description", "Only the menu item", "Only the grid width"], "question": "What should be verified before exposing a UBAQ write endpoint?", "explanation": "Write endpoints require tighter controls than read-only queries.", "correctIndex": 0}, {"options": ["The supplied Epicor REST Services guide includes workflows for creating, updating, and deleting records through Updatable BAQs.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Create, Update, and Delete with UBAQ REST”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["Expose only fields intentionally allowed to change", "Make every returned field editable", "Make all keys editable", "Allow new records by default"], "question": "What is the safest principle for editable fields in a UBAQ?", "explanation": "A UBAQ should expose the minimum required write surface.", "correctIndex": 0}, {"options": ["When custom validation or business-object orchestration is required", "For every read-only BAQ", "Only to change column labels", "To replace all query criteria"], "question": "When is Advanced BPM Update processing appropriate?", "explanation": "Advanced BPM processing is suited to business actions beyond simple mapped field updates.", "correctIndex": 0}, {"options": ["It shows exactly which record failed and why", "It automatically rolls back every row", "It removes the need for validation", "It makes the BAQ read-only"], "question": "Why is row-specific error feedback valuable in a multi-row UBAQ?", "explanation": "Users need actionable feedback tied to the failing row.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
29fd4dfc-1a6d-4eb0-ae96-7d3e5d197227	75ed1098-0b78-4f72-a2c1-a6df1b65a4ec	[{"options": ["Change production immediately", "Assess consumers and consider versioning the BAQ interface", "Hide it with DISTINCT", "Turn off security"], "question": "What is a safe response to a breaking BAQ schema change?", "explanation": "Integration-facing BAQs should be changed with API-style discipline.", "correctIndex": 1}, {"options": ["Integrations often fail because a field was renamed, a calculation changed type, or a filter silently changed.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “BAQs as Stable Integration Interfaces”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["External consumers may depend on field names, types, and parameters", "REST automatically makes it immutable", "It no longer needs testing", "It ignores BAQ security"], "question": "Why should a REST-exposed BAQ be treated like an API contract?", "explanation": "Changes to a BAQ schema can break consuming integrations.", "correctIndex": 0}, {"options": ["They are separate filtering mechanisms that can both be used", "They are exactly the same thing", "$filter automatically creates BAQ parameters", "Parameters work only for UBAQs"], "question": "What is the relationship between BAQ parameters and OData $filter?", "explanation": "The course distinguishes the BAQ's own parameters from REST-side OData filtering.", "correctIndex": 0}, {"options": ["Authentication, permissions, validation, allowed fields, and error behavior", "Only the BAQ description", "Only the browser theme", "Only the report layout"], "question": "What deserves extra review before exposing a UBAQ through REST?", "explanation": "Write-capable endpoints require tighter controls than read-only queries.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
602dd80f-35a8-44c4-bd29-0577309f02fe	2fadbcdf-f9c9-41e0-af4f-010fb1f556b9	[{"options": ["One customer", "One order line", "One invoice line", "One company"], "question": "What should one result row represent in this lab?", "explanation": "The BAQ is built directly from Customer with customer-level fields.", "correctIndex": 0}, {"options": ["Create a read-only shared BAQ from Erp.Customer that returns active customers with Company, CustID, Name, City, and State.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Lab 1 - Build an Active Customer BAQ”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["An explanation of grain, expected results, and validation", "Only a screenshot", "Only a Query ID", "Only the number of tables"], "question": "What should a lab submission include besides a query that runs?", "explanation": "The course emphasizes understanding and validating the design, not just producing output.", "correctIndex": 0}, {"options": ["Investigate grain, joins, and aggregation before changing the output", "Add DISTINCT immediately", "Ignore it if the total looks close", "Enable Updatable"], "question": "A lab result contains an unexpected duplicate total. What should the learner do?", "explanation": "The labs reinforce diagnosis rather than masking query-design problems.", "correctIndex": 0}, {"options": ["It includes design, testing, security/update behavior, and a real consumer", "It contains the largest number of tables", "It uses Cross Company", "It uses a calculated field"], "question": "What makes the final challenge production-oriented?", "explanation": "A production-ready BAQ solution includes correctness, safety, consumption, and maintainability.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
5ec20f27-19fe-45d5-932d-61412dd8c17f	8d1d7373-db66-4d55-b347-4cc6686cf1d1	[{"options": ["Join meaning and key verification", "UBAQs", "BAQ reports", "REST authentication"], "question": "What is the main learning objective?", "explanation": "This lab is about building and reasoning about a relationship.", "correctIndex": 0}, {"options": ["Build an order-header BAQ using OrderHed joined to Customer.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Lab 2 - Orders with Customer Name”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["An explanation of grain, expected results, and validation", "Only a screenshot", "Only a Query ID", "Only the number of tables"], "question": "What should a lab submission include besides a query that runs?", "explanation": "The course emphasizes understanding and validating the design, not just producing output.", "correctIndex": 0}, {"options": ["Investigate grain, joins, and aggregation before changing the output", "Add DISTINCT immediately", "Ignore it if the total looks close", "Enable Updatable"], "question": "A lab result contains an unexpected duplicate total. What should the learner do?", "explanation": "The labs reinforce diagnosis rather than masking query-design problems.", "correctIndex": 0}, {"options": ["It includes design, testing, security/update behavior, and a real consumer", "It contains the largest number of tables", "It uses Cross Company", "It uses a calculated field"], "question": "What makes the final challenge production-oriented?", "explanation": "A production-ready BAQ solution includes correctness, safety, consumption, and maintainability.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
4f4b4550-d59a-4718-af12-061b06aae45f	68d42ede-bb23-4097-93cd-815bdb5d93db	[{"options": ["The customer value is supplied through a parameter", "It has a fixed customer constant", "It is cross-company", "It has no criteria"], "question": "What makes this BAQ reusable?", "explanation": "The parameter allows the same query definition to serve multiple customer values.", "correctIndex": 0}, {"options": ["Add a customer parameter such as pCustomerID to the order BAQ.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Lab 3 - Parameterized Open Orders”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["When the value should be supplied at runtime", "When the rule is permanently fixed", "Only when the BAQ is updatable", "Only when building a report"], "question": "When should a BAQ parameter be used instead of a hard-coded constant?", "explanation": "Parameters make the same BAQ reusable for different caller-supplied values.", "correctIndex": 0}, {"options": ["Fewer unnecessary rows participate in later query processing", "All fields automatically become editable", "Joins are no longer required", "Security is automatically configured"], "question": "What is a common benefit of applying selective criteria early?", "explanation": "Early filtering improves clarity and can reduce query workload.", "correctIndex": 0}, {"options": ["In the consuming UI/runtime layer", "Hard-coded permanently into every BAQ", "In a DISTINCT expression", "In the Security ID"], "question": "A screen-specific filter depends on the currently selected order. Where does that context usually belong?", "explanation": "Runtime screen context generally belongs in the consuming layer, while universal rules belong in the BAQ.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
b107b56b-abb7-47a9-9d8e-4922cd184375	ea7a938f-3784-40cc-bf4a-ed3a7d84c91c	[{"options": ["Aggregate at the level the value belongs to before joining it to a lower-level result", "Use DISTINCT on everything", "Remove joins", "Make it cross-company"], "question": "What is the key design principle?", "explanation": "Pre-aggregation protects higher-level values from detail-row multiplication.", "correctIndex": 0}, {"options": ["Build a detail-level result that needs one shipment-level total.", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Lab 4 - Aggregate Shipment Value without Duplication”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["The expression and a compatible result data type", "Only the display label", "Only whether the query is Shared", "Only the company"], "question": "What must be considered when defining a calculated field?", "explanation": "A calculated field needs an expression and a data type that correctly represents the result.", "correctIndex": 0}, {"options": ["Multiple detail rows can become one summarized row", "Nothing changes", "The BAQ automatically becomes updatable", "All joins become outer joins"], "question": "What happens to query grain when rows are grouped and aggregated?", "explanation": "Grouping changes what each result row represents.", "correctIndex": 0}, {"options": ["When it is used to hide unexplained duplicate multiplication", "When unique projected rows are genuinely required", "When reviewing output", "When testing a calculated field"], "question": "When is DISTINCT most questionable?", "explanation": "The lesson warns against using DISTINCT as a repair for incorrect query design.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
c50e6456-d0cd-498b-96cb-e8bf67194523	62b44969-cb74-46ed-a807-2ac4757184f0	[{"options": ["Only a working grid", "Correct data design, controlled update behavior, integration, testing, and documentation", "Only a REST URL", "Only a calculated field"], "question": "What makes the capstone complete?", "explanation": "A production-quality BAQ solution includes design, safety, consumption, and maintainability.", "correctIndex": 1}, {"options": ["Create a small BAQ solution with three parts: (1) a read-only parameterized BAQ, (2) a controlled UBAQ action using an editable calculated selection field, and (3) one consumer...", "The safest approach is to enable every optional feature by default.", "If the BAQ returns rows, its business logic no longer needs verification.", "Unexpected duplicates should normally be hidden before investigating their cause."], "question": "Which statement is supported by the lesson “Final Challenge - Read, Update, and Integrate”?", "explanation": "This answer is taken directly from the guidance in this lesson.", "correctIndex": 0}, {"options": ["An explanation of grain, expected results, and validation", "Only a screenshot", "Only a Query ID", "Only the number of tables"], "question": "What should a lab submission include besides a query that runs?", "explanation": "The course emphasizes understanding and validating the design, not just producing output.", "correctIndex": 0}, {"options": ["Investigate grain, joins, and aggregation before changing the output", "Add DISTINCT immediately", "Ignore it if the total looks close", "Enable Updatable"], "question": "A lab result contains an unexpected duplicate total. What should the learner do?", "explanation": "The labs reinforce diagnosis rather than masking query-design problems.", "correctIndex": 0}, {"options": ["It includes design, testing, security/update behavior, and a real consumer", "It contains the largest number of tables", "It uses Cross Company", "It uses a calculated field"], "question": "What makes the final challenge production-oriented?", "explanation": "A production-ready BAQ solution includes correctness, safety, consumption, and maintainability.", "correctIndex": 0}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."skills" ("id", "slug", "name", "description", "sequence_order", "created_at", "updated_at") FROM stdin;
aaebccaf-d898-459e-99b1-6f10dd99e06f	epicor-foundations	Epicor Foundations	Core Epicor and Kinetic concepts, access, navigation, and business context.	1	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
60ab82dd-ec59-4b03-bde3-307e81adbac2	kinetic-navigation	Kinetic Navigation	Navigating Kinetic applications, menus, pages, and developer entry points.	2	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
1062494b-b955-4444-89cd-eee72935350b	application-studio	Application Studio	Using Application Studio to inspect, configure, test, and manage Kinetic applications.	3	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
0a9560c7-7240-400f-be0d-2c4407348e0d	ui-components	UI Components	Choosing, configuring, and composing Kinetic UI components.	4	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
4b7cd404-e589-4739-a2ed-f04d6f04cf01	events	Events	Using event-driven behavior to respond to user and application activity.	5	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
196856ee-5894-4d04-a068-ab271baed9f4	widgets	Widgets	Building data-entry and display experiences with Kinetic widgets.	6	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
6cc55cc6-dc72-442d-bf73-e19eef39cd62	dataviews	DataViews	Modeling, loading, filtering, and binding client-side DataViews.	7	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
fc5e9ac5-7ed0-40b3-bf46-e7616a73fa1d	conditions	Conditions	Expressing declarative conditions, data rules, and branching UI logic.	8	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
da751914-8d1a-4697-8381-d5f6191e444e	layers	Layers	Creating and maintaining upgrade-friendly Application Studio layers.	9	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
c09ef3ac-3c7a-458c-b2e4-d5d1c9764312	publishing	Publishing	Testing, upgrading, and publishing Kinetic customizations safely.	10	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
499080cc-35a8-4bc3-b0bf-6eb968dfee47	functions	Functions	Using reusable Epicor Functions and server-side logic from Kinetic.	11	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
1aec1e13-0066-4bd7-8241-b6b0a948b778	debugging	Debugging	Diagnosing configuration, data, event, and publishing problems.	12	2026-08-12 20:09:00.101609+00	2026-08-12 20:09:00.101609+00
\.


--
-- Data for Name: subtopics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."subtopics" ("id", "topic_id", "title", "sequence_order", "content_json", "created_at", "updated_at", "est_minutes", "learning_objectives", "skills", "glossary_terms", "completion_rule") FROM stdin;
e4b5663e-3443-4594-860a-5210c75d35b3	125375c3-ad6d-45c2-b736-e7a3d795b264	What Is Application Studio?	0	[{"body": ["Application Studio is Epicor Kinetic's low-code/no-code design environment for power users, business analysts, and developers to tailor ERP applications to real business needs — without touching source code.", "Configurations you build here live in **layers** that sit on top of the base application. Layers survive upgrades far better than classic customizations because Kinetic re-applies them intelligently instead of patching compiled forms.", "Don't confuse a **layer** (a company-wide customization) with a **personalization** (a single user's private tweak). Layers can later be promoted from a personalization, so a great personal fix can become a company standard.", "To use Application Studio at all, your user account needs the Customize Privileges checkbox enabled in User Account Security Maintenance."], "type": "SlideText", "proTip": "Press Ctrl+Alt+D from inside almost any Kinetic screen to jump straight into Application Studio for that screen.", "heading": "What Is Application Studio?"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
0ad0cb8b-4721-4a61-a98e-590d059c34af	125375c3-ad6d-45c2-b736-e7a3d795b264	Two Ways to Launch Application Studio	1	[{"body": ["**Method 1 — From an open application:** Open the screen you want to modify, then use the Overflow menu → Application Studio, or the shortcut Ctrl+Alt+D.", "**Method 2 — From the Application Studio Homepage:** System Management → Kinetic Application Management → Application Studio. This grid lists every base and layered application in your system, with filters for type and last-update date.", "When you land in Application Studio you're always on a fresh, unsaved layer. You must create a new layer or load an existing one before you can preview, save, or publish anything."], "type": "SlideText", "heading": "Two Ways to Launch Application Studio"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
42d231f7-679f-4ad2-be1e-2c91dbe8a09b	125375c3-ad6d-45c2-b736-e7a3d795b264	The Layer Lifecycle: Create → Save (Draft) → Publish	2	[{"body": ["Creating a layer requires a mandatory **Layer Name** and **Description**. You also choose which company (or ALL companies) the layer applies to.", "Every save is stored as a **Draft**. Drafts are invisible to end users. Only a **Publish** action makes a layer selectable in Menu Maintenance so real users can see the change — and every publish is timestamped in the Publish History log.", "If a user opens a published layer, edits it, and saves, the edit becomes a new unpublished draft again. You must re-publish to push the change live.", "You can stack multiple layers on one application. Order matters: the **last** layer selected wins any conflicts, but non-conflicting changes from every layer all apply together."], "type": "SlideText", "proTip": "Think of layer order like CSS specificity — last one loaded overrides earlier ones only where they actually collide.", "heading": "The Layer Lifecycle: Create → Save (Draft) → Publish"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
b0d60149-718d-4683-b941-95fe592801a5	125375c3-ad6d-45c2-b736-e7a3d795b264	The Four App Designers	3	[{"body": ["**Application Map** — the default view; shows the page hierarchy as a navigable tree/map. Add, rename, or delete pages here.", "**Layout** — drag components from the Toolbox (textboxes, grids, buttons, checkboxes...) onto the canvas to build a page.", "**Data Rules** — define conditions and actions that control how fields behave (highlight, disable, hide) without any code.", "**Events** — wire up triggered logic: button clicks, page loads, REST calls, message boxes, and more.", "**DataViews** — the data plumbing layer; each view maps to one underlying data table and can define parent/child relationships, filters, and tools like Add/Delete."], "type": "SlideText", "heading": "The Four App Designers"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
560629b6-3e24-4c7d-ae60-0594f0a27a78	125375c3-ad6d-45c2-b736-e7a3d795b264	Mobile Layers & Built-in Debugging	4	[{"body": ["Kinetic apps are responsive by default, but you can create dedicated **Phone** or **Tablet** child layers under an Any Device parent layer for a purpose-built mobile experience — only one Phone and one Tablet layer per parent.", "The **Debug Tool** (Ctrl+Shift+D) shows the live call log and dataview contents while you run or preview an app — flip on Auto-Load while previewing in Application Studio to see your layout edits reflected instantly.", "Browser DevTools add another level: Ctrl+Alt+8 toggles dataview event logging, Ctrl+Alt+I loads component objects for inspection, and Ctrl+Alt+V dumps all dataviews. Kinetic 2023.2 adds **EO Browser debugging** for the Smart Client via a sysconfig flag."], "type": "SlideText", "heading": "Mobile Layers & Built-in Debugging"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
1f71d11d-82df-4adf-866c-3cef11839d07	125375c3-ad6d-45c2-b736-e7a3d795b264	Shortcuts & Moving Layers Between Companies	5	[{"body": ["**Setting Up Shortcuts**: on any page's header properties, scroll to the epActions list — every action on that page can get a custom keyboard shortcut (e.g., Ctrl+Alt+S for Search). Once saved and published, that shortcut becomes the default for everyone using the layer, though users can still override it via personalization.", "**The Save As option**: when creating a layer, you pick a Company Name (defaults to ALL, but can be scoped to one company). If you built and tested a layer in a sandbox/test company, use **Save As** to copy that same layer into a production company — without rebuilding it from scratch.", "Combine both: build and test in a sandbox company with a fast shortcut for your most-used action, verify everything works, then Save As into production once you're confident."], "type": "SlideText", "heading": "Shortcuts & Moving Layers Between Companies"}]	2026-08-12 07:16:50.927147+00	2026-08-12 07:16:50.927147+00	\N	{}	{}	{}	read
8d8134a1-7cf5-468f-8749-ef3b8e17b851	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	The Landing Page & Application Dataset	0	[{"body": ["The **Landing Page** defines what a user sees the instant an application launches — typically a searchable grid (PanelCardGrid) bound to a dynamic 'LandingPage' dataview populated via GetRows.", "Every application has one root **Dataset** (e.g., Customer) that everything downstream binds to. A small patch icon appears next to a property whenever a Business Process Management (BPM) patch is affecting it.", "Key landing page properties: Name, Caption, PageType (Apps/Process/Report/Dashboard/Shared), UseFullWidth, and EpBinding — the glue that ties a UI control to a specific application view."], "type": "SlideText", "heading": "The Landing Page & Application Dataset"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
11ed38f9-8744-4510-9623-e56486d68765	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	Tabs vs. Pages vs. Virtual Pages	1	[{"body": ["A **Tab** is a navigation entry point tied to a Tab Page; selecting one drives what shows in the Navigation Tree below it (e.g., Details vs. Activity).", "A **Page** (usually PageType = TabPage) is where real layout components live — panels, grids, fields. Its EpBinding links it to a specific record context, and PageCaption can even show dynamic values like `Customer.CustID`.", "**Virtual Pages** are just PanelCard or PanelCardGrid components with Full Screen visualization enabled. At runtime a Full Screen button expands them to show extra containers of detail while hiding the rest of the page — great for dense data without leaving the screen."], "type": "SlideText", "proTip": "Deleting a Virtual Page from the Application Map simply clears the EnableFullScreen flag on its panel — nothing destructive happens to your data.", "heading": "Tabs vs. Pages vs. Virtual Pages"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
64720cb1-6d41-42a4-b1a6-8cfbf9905aac	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	Sliding Panels: Contextual Overlays Done Right	2	[{"body": ["Sliding Panels glide in from the right edge of the screen to show contextual info, confirmations, or Info/Warning/Success/Error dialogs — triggered by an event such as a button click.", "Configurable properties include HideCloseIcon, ShowTitle, ShowButtons, and CollapseOnOutsideClick. You can add custom Buttons and Overflow Actions directly on the panel.", "**Reusable Sliding Panels** (SDK required) are entire mini-applications that any parent app can open via an app-open action, pass parameters into (ValueIn with `ParamName: DataView.Column` syntax), and receive results back from via OnOk/OnCancel handlers."], "type": "SlideText", "heading": "Sliding Panels: Contextual Overlays Done Right"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
651e5d60-f349-4a18-a683-4fa330f5432d	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	FlexLayout: Responsive Panel Widths	3	[{"body": ["FlexLayout is active by default on the main application page. It exposes a Minimum Width dropdown on panel cards, panel grid cards, and group boxes so you can precisely control how components share horizontal space.", "Example: set three panel cards to Minimum Width = 33 each and they'll line up side by side instead of stacking vertically. The same trick works one level deeper on GroupBoxes nested inside a panel card.", "This is the single most useful tool for turning a cramped, boring, vertically-stacked form into a clean, wide-screen-friendly dashboard-style layout."], "type": "SlideText", "heading": "FlexLayout: Responsive Panel Widths"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
4623dda5-4120-434a-90be-8c79590a9065	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	Creating New Pages & Tabs	4	[{"body": ["To add a page: select the parent node in the Application Map tree, choose Add, then set Name / Caption / PageType. Drop in components, save the layer, and Preview to confirm.", "To surface it as a Tab: add the page under the target Tab node, then edit the parent's TabStrip component properties → Data → add a new tab entry whose Id/Title matches the page's Name/TabID exactly, and set Page to your new page.", "Mismatched Name/TabID values are one of the most common beginner mistakes — Application Studio's Problems panel will flag validation errors if they don't line up."], "type": "SlideText", "heading": "Creating New Pages & Tabs"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
48433b84-255f-49e8-bfe9-76a94709db07	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	BAQ Reports & the Basic Application Wizard	5	[{"body": ["**BAQ Reports** wrap a Business Activity Query into a submission form + printable output. You modify the submission form's layout in Application Studio just like any other app, and separately update the underlying **Report Definition** (the actual print layout/RDL) to change what appears on the printed output.", "The **Basic Application Wizard** (launched from the Application Studio Homepage) builds a complete single-page or parent/child application without touching the Layout designer by hand: you pick a Parent DataView, its Grid, and its Form Card, then optionally repeat for a Child DataView/Grid/Form Card.", "After finishing, the wizard shows a **Validation Process** summary. Common validation errors include: Invalid Parent-Child Relationship (the child view isn't actually linked to the parent), Invalid DataView Filter Mappings, and Invalid Grid View Option Filter — all fixable directly back in Application Studio without restarting the wizard."], "type": "SlideText", "proTip": "Use the Basic Application Wizard for straightforward CRUD screens — it's dramatically faster than hand-building the Application Map, and you can still refine the result afterward like any normal layer.", "heading": "BAQ Reports & the Basic Application Wizard"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
835868e8-29ba-4874-af28-80b371532bb3	fcf88bda-2531-4bf2-b0a6-8b755c4decd2	Simple Landing Page Modifications & Skip Landing Page	6	[{"body": ["**Quick Filters** add one-click filter buttons above a landing page grid (e.g., 'Open Orders Only') — configured as View Options tied to a static filter expression, so users don't have to build a filter manually every time.", "**Job Status Checkboxes** are a common landing-page pattern: add checkboxes bound to status columns, then add a Data Rule that filters the grid based on which boxes are checked — letting users toggle between 'Open,' 'Closed,' 'On Hold,' etc. without a full search form.", "**Skip Landing Page** lets an application jump straight to a specific record's Details page instead of showing the searchable grid first — useful for menu items meant to always open the same fixed record (like a single company-wide settings screen)."], "type": "SlideText", "heading": "Simple Landing Page Modifications & Skip Landing Page"}]	2026-08-12 07:16:51.203086+00	2026-08-12 07:16:51.203086+00	\N	{}	{}	{}	read
16fe8265-5259-4a2d-8be7-cfbfe03c2728	6ee03325-3f28-452e-bb59-34d2a76a2c97	The Component Containment Model	0	[{"body": ["Kinetic components fall into three tiers: **Host containers** (PanelCard, PanelCardGrid, PanelCardGantt) hold everything else and can be dropped directly on a page.", "**Organizer components** (1Column, 2Column, Container, GroupBox) provide the second level of nesting — they must live inside a host container but can hold lower-level controls.", "**Leaf controls** (Button, TextBox, ComboBox, CheckBox, DatePicker, Grid, etc.) are the actual data-entry and display elements — they cannot float free on a page; they must sit inside an organizer or host.", "Kinetic 2023.2 formalized **nested components**: you can drop organizer components inside other organizers to build complex side-by-side arrangements of 6, 7, or more controls in a single row."], "type": "SlideText", "heading": "The Component Containment Model"}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00	\N	{}	{}	{}	read
26401bd9-cb10-435c-81c8-dbb78dae420e	6ee03325-3f28-452e-bb59-34d2a76a2c97	Required Properties & Design Mode	1	[{"body": ["Required properties live in the Basic group and are marked with an asterisk. The most important is **Id** — always rename generic auto-IDs (like NewRule-1) to something meaningful, because you'll reference these IDs constantly inside Events and Data Rules.", "In Application Studio's Design Mode, components are intentionally inert — you can't type into a textbox or pick a date, because no real data is loaded. Always use **Preview** to test actual runtime behavior.", "The State group hoses Hidden, Disabled, ReadOnly, Personalizable and Customizable flags. Turning off Personalizable locks a field from end-user personalization while keeping it fully visible; turning off Customizable locks it from being touched by other layers entirely."], "type": "SlideText", "proTip": "Clearing 'Personalizable' is the correct way to protect a compliance-critical field from being hidden by end users, without breaking the layout for everyone else.", "heading": "Required Properties & Design Mode"}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00	\N	{}	{}	{}	read
7fbeaad9-cb00-4654-984d-51bca294d132	6ee03325-3f28-452e-bb59-34d2a76a2c97	Full-Screen Views for Dense Data	2	[{"body": ["PanelCardGrid gets Enable Full Screen by default — an automatic secondary view appears for grid rows that don't fit the summary card.", "For a PanelCard, you must enable Full Screen manually. Once enabled, a second container box appears: keep your must-see fields in the primary container, and push secondary detail fields into the second container which is only shown after clicking Full Screen.", "At runtime, full-screen views also appear as separate nodes in the navigation tree, so users can deep-link directly to the expanded view."], "type": "SlideText", "heading": "Full-Screen Views for Dense Data"}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00	\N	{}	{}	{}	read
61ad810f-9aca-4a9e-8ddb-3e1b22e56caf	6ee03325-3f28-452e-bb59-34d2a76a2c97	Building Reusable Components (SDK)	3	[{"body": ["With an SDK license, the Custom Component Editor lets you build UI snippets once — panel cards, buttons, combos, whatever — and reuse them across every application you customize.", "Workflow: Application Studio Homepage → Components tab → New → design in the editor → Save & Publish → the component now appears under Toolbox → User Defined in every layer.", "Custom components can host any base control except widgets or other custom components (no infinite nesting of user-defined components)."], "type": "SlideText", "heading": "Building Reusable Components (SDK)"}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00	\N	{}	{}	{}	read
ffd40c9a-c6cb-4806-93ed-8912c8b5e57f	6ee03325-3f28-452e-bb59-34d2a76a2c97	Fixing Orphaned Components After Upgrades	4	[{"body": ["When a base application's container layout changes (a card gets removed) but a child layer still has a component bound inside that now-missing container, the component becomes **orphaned** — it silently disappears from the layout.", "Kinetic 2023.2 surfaces this clearly: a warning banner appears, and an 'Orphan Components' card lists every stranded control at the bottom of the affected page so you can drag it to a new home or delete it outright.", "Always re-test every customization layer after a major version upgrade — even a 'fully converted' layer needs manual verification."], "type": "SlideText", "heading": "Fixing Orphaned Components After Upgrades"}]	2026-08-12 07:16:51.476604+00	2026-08-12 07:16:51.476604+00	\N	{}	{}	{}	read
f4b4ef8b-046d-4481-8ec8-5ba854f2f4da	2c98fcce-ad1c-4454-acac-f57701b5a900	Application Studio Homepage: Mission Control	0	[{"body": ["The Homepage grid lists every base and layered application with sort, group-by, and filter tools. Use it to find, upgrade, and publish layers in bulk instead of one at a time.", "**Dashboard Developer** rights let you modify base dashboards; **Customize Privileges** rights let you create new layers/alternate versions of existing apps. An SDK license unlocks creating brand-new applications from templates (Apps, Configurator, Dashboard, Process, Report, Shared).", "2023.2 adds a clear visual indicator distinguishing system apps (ticked) from custom apps (no indicator) directly in the Homepage grid — much faster triage across a large system."], "type": "SlideText", "heading": "Application Studio Homepage: Mission Control"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
cbcfffca-32b9-4f03-8b98-6b2ab659be1d	2c98fcce-ad1c-4454-acac-f57701b5a900	Bulk Upgrading & Publishing Layers	1	[{"body": ["Select multiple layers via checkboxes, then Overflow menu → Upgrade Selected Layers. The system automatically upgrades the base application and every dependent layer, skipping anything already current.", "Watch the Status column: Upgrade Success vs. Upgrade Failed (with an Error column explaining why) — use the Debug Tool or browser DevTools to chase down failures.", "Publishing works the same way: select unpublished (HasDraft) layers, then Publish Selected Layers in one batch instead of clicking through each app individually."], "type": "SlideText", "heading": "Bulk Upgrading & Publishing Layers"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
ebdcd813-1683-4f2f-b218-94d43b954232	2c98fcce-ad1c-4454-acac-f57701b5a900	Classic-to-Kinetic Conversion Logic	2	[{"body": ["Program 180 auto-converts Classic customization layers into Kinetic layers during an upgrade — but only for Customization-type layers by default (you can target specific layers with a CustomizationConversionSettings XML file and a mandatory Key1 tag).", "It reliably converts simple UI components, combo boxes, foreign-key dataviews, sub-table dataviews, and wizard-generated data rules. It cannot convert custom actions/conditions in Data Rules or client-side logic based on custom code — that logic must be rebuilt using Functions and BPM directives on the server.", "Always verify converted layers in the Configuration Upgrade Dashboard: Pass (verify only), Warning (needs edits), or Error (needs a full rework)."], "type": "SlideText", "heading": "Classic-to-Kinetic Conversion Logic"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
0e60aeec-1ed1-4f14-9bc8-11669095fcb5	2c98fcce-ad1c-4454-acac-f57701b5a900	Governance: Finding Active Customizations & Cleaning Up	3	[{"body": ["Build a cross-company BAQ against the Ice.Menu table filtering Arguments LIKE '%-c%' to discover every custom menu item actively running across your entire organization — essential before a major upgrade project.", "2023.2 lets non-SDK users with Customization rights delete unused custom base apps and their layers directly from the Homepage grid overflow menu — no more orphaned junk piling up over the years.", "Deleting a parent base app cascades to delete its child layers too, so always confirm scope before you click delete."], "type": "SlideText", "heading": "Governance: Finding Active Customizations & Cleaning Up"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
3d57f373-e661-443f-83cc-8661e9e5a479	2c98fcce-ad1c-4454-acac-f57701b5a900	User-Defined Forms & the Kinetic SDK	4	[{"body": ["With the SDK, the **UD Service Designer** lets you create brand-new user-defined services/tables, add fields, and deploy them as full Kinetic screens with their own base events — genuinely building new functionality, not just customizing existing screens.", "Typical flow: define UD codes → add a UD field to a core table (e.g., Part) → regenerate the data model → surface the new field in the UI via a ComboBox or panel → deploy the layer.", "This is the deepest level of App Studio work — pair it with Functions and BPM Directives for validation and cross-system integration logic, exactly the kind of stack you already work with in Epicor."], "type": "SlideText", "heading": "User-Defined Forms & the Kinetic SDK"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
001f9763-7e95-4d78-a0d2-b26257ba5fb1	2c98fcce-ad1c-4454-acac-f57701b5a900	Real Scenario: UD Codes & the Part Advisor	5	[{"body": ["This real scenario from the guide extends Part Maintenance with a 'Soap Type' subtype system entirely through UD tooling: first, define **User-Defined (UD) Codes** for each Part subtype using the UD Code maintenance screen — these become the selectable values in your new field.", "Add a **UD field** to the Part table, then **regenerate the data model** so the field becomes queryable across BAQs, BPM, and Application Studio. Add a **ComboBox** bound to that field, populated from your new UD codes, directly onto Part Maintenance's layout.", "Finally, wire up the *experience*: an event launches a website based on which subtype is selected, a button gets disabled for subtypes where that action doesn't apply, and a Data Rule highlights fields relevant to the selected subtype — then a matching **PanelCardGrid** bound to a BAQ surfaces additional part info on a companion screen (Part Advisor). Deploy both the modified Part Maintenance and Part Advisor as a linked pair via Menu Maintenance."], "type": "SlideText", "proTip": "This UD Codes → UD Field → regenerate model → ComboBox pattern is the standard recipe any time you need a brand-new categorization system without touching the core schema.", "heading": "Real Scenario: UD Codes & the Part Advisor"}]	2026-08-12 07:16:53.23944+00	2026-08-12 07:16:53.23944+00	\N	{}	{}	{}	read
1fe98eca-b33a-40af-ba9d-9af7cdeef13b	a53f8dd7-b87b-4dab-8dbd-4fe252e3f9a1	Create Calculated Fields	2	[{"body": [{"text": "Calculated fields let the BAQ return values that are not stored directly as one database column. The supplied BPM Cookbook demonstrates using the **Calculated Field SQL Editor**, choosing a field name, data type, label, and expression.", "type": "paragraph"}, {"text": "Useful patterns include arithmetic, conditional CASE logic, null handling, flags, derived descriptions, and amounts converted into a reporting unit.", "type": "paragraph"}], "type": "SlideText", "proTip": "Give calculated fields business names such as Calculated_OpenValue, not Calculated_Field1.", "heading": "Calculated Fields Add Business Meaning"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
d6385c9d-23e2-4b22-881b-73a7c918c8c9	0b1740e2-f7fc-4be4-907a-a343f792ec17	Anatomy of a Data Rule	0	[{"body": ["Every rule needs a Header (Name + Description), a Row Rule Criteria (Condition or No Condition), and one or more Actions.", "Example: Condition = OrderDtl.DiscountPercent > 8 → Action = SettingStyle → Highlight the Discount and UnitPrice fields, and Disable OrderQty. Zero code, fully declarative.", "Highlight colors follow a status convention: Red = Error, Orange = Warning, Green = Ok, Blue = Highlight — keep this consistent so users learn to read your app at a glance.", "System rules ship with the base app and can be copied but never edited or deleted. User-created rules can be freely copied, edited, disabled, or deleted."], "type": "SlideText", "heading": "Anatomy of a Data Rule"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
e8452961-043e-4d93-81c4-219d171ede0e	0b1740e2-f7fc-4be4-907a-a343f792ec17	Cross-DataView Rules	1	[{"body": ["A Cross-DataView Rule lets a condition on one dataview trigger an action on a *different* dataview — e.g., a discount threshold on OrderHed makes a field ReadOnly on OrderDtl.", "This is a 2023.2 capability that removes the need for a workaround event just to bridge two related views.", "Function-based row rule criteria (VB.NET functions) are deprecated for new rules due to performance and security concerns — existing ones still run, but rebuild new logic using Conditions."], "type": "SlideText", "proTip": "Avoid functions in row rules going forward — Application Studio will flag a performance warning if you try to reuse one.", "heading": "Cross-DataView Rules"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
9ac76d2d-a5e9-4566-a1f3-8a8715723c0c	0b1740e2-f7fc-4be4-907a-a343f792ec17	Events: Triggers, Actions & Workflow	2	[{"body": ["An Event is one action or a chained sequence of actions: navigate, update a field, show a message, call a REST endpoint — triggered by something in the UI (a click, a row change) or invoked from another event.", "Triggered events have a Trigger definition: Type (Control/Data/Event), Hook (OnClick/Before/After/Override), and Target (which component or system event to hook).", "You cannot edit a base-layer system event directly, but you CAN create your own event with a Before or After hook pointed at that system event's ID — your logic runs alongside it without ever touching Epicor's original workflow."], "type": "SlideText", "heading": "Events: Triggers, Actions & Workflow"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
5735e445-a690-43ce-879a-7076f683cae7	0b1740e2-f7fc-4be4-907a-a343f792ec17	Overriding System Events (2023.2)	3	[{"body": ["Beyond Before/After hooks, 2023.2 introduces the **Override** hook type: your custom event runs INSTEAD of the targeted system event.", "Classic use case: replace the stock 'record created' toast with your own branded message by overriding AfterGetNew with a custom event containing an erp-message-handler action set to a Toast/Info level with your own text.", "Use overrides sparingly — you're now fully responsible for anything the original system event used to do."], "type": "SlideText", "heading": "Overriding System Events (2023.2)"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
b1870cc8-45b1-4992-89b5-faa406076406	0b1740e2-f7fc-4be4-907a-a343f792ec17	Allow Interaction During Events	4	[{"body": ["By default, the application pauses/locks while an event workflow executes. Enabling **Allow interaction during events** (available at the layer level and per-trigger) lets users keep working while a longer process runs in the background.", "This is ideal for slow REST calls or reports so users aren't stuck staring at a frozen screen — but be careful: if your workflow assumes the user hasn't changed context, allowing interaction can introduce race conditions."], "type": "SlideText", "heading": "Allow Interaction During Events"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
70ac73ab-b9e3-4366-8a39-c4b1e84dd021	0b1740e2-f7fc-4be4-907a-a343f792ec17	ERP-BAQ Event Action: Five Operation Modes	5	[{"body": ["The **erp-baq** event action can add, update, and validate data straight against a BAQ-backed table, configured via its **BAQ Update Options** node and an Operations dropdown with five modes.", "**getNew** adds a new row to the BAQ table for users to fill in. **update** saves changes to a single row by default — select **SendAllRows** to save every changed row at once, and **RollbackDataOnError** to prevent partial saves when something fails.", "**fieldUpdate** notifies the server that one field changed so related fields can recalculate (e.g., changing Part Number triggers Unit of Measure and Description to update) — typically hooked to a column-changed event. **fieldValidate** checks a field's value against a rule before the change commits (e.g., enforcing Part Type = 'M' for manufactured-only entry) — also hooked to a column-changing event. **Custom Action** links the BAQ action straight to any other custom action you've defined, optionally sending all matched rows."], "type": "SlideText", "heading": "ERP-BAQ Event Action: Five Operation Modes"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
a09b5942-88f5-417f-84af-fc6b99b17359	0b1740e2-f7fc-4be4-907a-a343f792ec17	Function Criteria & Disabling Events (2023.2)	6	[{"body": ["Existing Data Rules that use **Function** row-rule criteria (VB.NET functions) continue to run in 2023.2, but you can no longer select Function as the criteria type for brand-new rules — Application Studio now steers everyone toward Conditions for performance and security reasons. If you switch an existing rule's criteria away from Function, you can't switch it back.", "2023.2 also lets you **disable** a specific event outright without deleting it — handy when a custom event misbehaves after an upgrade but you want to keep its configuration around to fix later rather than losing the work. Re-enable it from the same overflow menu once you've resolved the issue."], "type": "SlideText", "heading": "Function Criteria & Disabling Events (2023.2)"}]	2026-08-12 07:16:51.745395+00	2026-08-12 07:16:51.745395+00	\N	{}	{}	{}	read
33dcf2a9-885f-4528-a247-fe48e40f3062	01de9403-0222-443b-b13f-0193ef42d38b	What Are Kinetic Functions?	0	[{"body": ["**Functions** let you call into server-side logic or database tables — similar to BPM directives — but as a reusable, independently deployable unit. A Function is defined inside a **Library**, which is the single unit of deployment for one or more Functions.", "Because Functions are server-side, you can reuse the same Function across any client (desktop, browser, mobile) and even call it from a BPM directive. Functions are also exposed directly in the **Kinetic REST API v.2** — Kinetic applications already talk to the server via REST calls to v.2 endpoints, so Application Studio events can call your Function the exact same way.", "Two security groups control who can work with Functions: **Functions Administrator** (can publish/unpublish libraries) and **Functions Developer** (can create Widget Functions). Your account needs at least one of these to build or use Functions."], "type": "SlideText", "heading": "What Are Kinetic Functions?"}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00	\N	{}	{}	{}	read
6ebedb21-9649-4082-b62d-c49a27ff1d7c	a020390c-a9d9-4e19-918a-57bd552dcad6	Rich Content & Visualization Components	3	[{"body": ["**PDFViewer** renders a PDF inline in the page — handy for showing an attached document without leaving the screen. **RichTextEditor** gives users a WYSIWYG editor for formatted notes/descriptions instead of a plain TextArea.", "**RelationshipMap** visualizes hierarchical or networked relationships (e.g., BOM structures) as an interactive diagram. **Scheduler** renders a calendar/timeline view for resource or job scheduling. **MultiviewCalendar** shows multiple calendar views side by side.", "**PictureBox** displays an image bound to a data column (e.g., a part photo) — commonly paired with FilePickerClient so users can upload a new image directly into the same field."], "type": "SlideText", "heading": "Rich Content & Visualization Components"}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00	\N	{}	{}	{}	read
536ea465-46f1-4a40-850d-f71a4db6e79d	50ea9ec9-f247-48cf-98ee-34a43cea2ede	System DataViews You'll Use Constantly	0	[{"body": ["**TransView** exposes KeyFields, actionResult, searchResult, Constant, CallContextBpmData/CallContextClientData, sysTools, and matches — the plumbing every custom view can tap into.", "**Constant** holds dozens of ready-made system values: CompanyID, CurrentUserID, Today, Tomorrow, FirstDayOfMonth, PlantID, and more — use these instead of hardcoding values in filters or bindings.", "**matches** is the temporary dataview created automatically whenever a dataview-condition action selects a subset of rows — perfect for looping a row-update action across every matching record in one event."], "type": "SlideText", "heading": "System DataViews You'll Use Constantly"}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00	\N	{}	{}	{}	read
ee2e7570-1581-47d7-8751-4fb4d3f8e260	50ea9ec9-f247-48cf-98ee-34a43cea2ede	Defining a New DataView	1	[{"body": ["Creating a view means: map it to a data source, define parent/child relationships if needed, set static filters, add columns (including calculated/additional columns not present on the server dataset), and configure context menus per column.", "Static filters use the format `DataView.Column = 'Value'` (comma-separate multiple criteria) — handy when two views share one underlying server table but need to show different subsets, like splitting Credit Memo payments by IsCreditPayment true/false.", "You can load data into a view four ways: GridProviderModel, a service method dataset, a BAQ Results dataset (via the ERP-BAQ event action), or a Function's response parameter of tableset type."], "type": "SlideText", "heading": "Defining a New DataView"}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00	\N	{}	{}	{}	read
7ebcb493-2785-4c2e-95be-67ce811bb6fc	50ea9ec9-f247-48cf-98ee-34a43cea2ede	Widgets & Kinetic Dashboards	2	[{"body": ["Widgets add rich visualizations: Data Discovery Cards, Data Discovery Charts, and Website Widgets (embed any HTTPS page, with EpBinding values injected via curly braces, e.g. a Google Maps URL keyed off `ShipHead.ShipToAddressFormatted`).", "Classic dashboards must be copied and generated as a Kinetic UX application (Tools → Deploy Dashboard) before you can style them in Application Studio — then add them to the main menu through Menu Maintenance.", "Once generated, a Kinetic dashboard is just another application layer — resize panels, rename captions, add view options to grids, exactly like any other screen."], "type": "SlideText", "heading": "Widgets & Kinetic Dashboards"}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00	\N	{}	{}	{}	read
ea4eaa3c-d4c1-49ce-94c3-6f0c39361713	50ea9ec9-f247-48cf-98ee-34a43cea2ede	Wiring a Sliding Panel End-to-End	3	[{"body": ["1) Add an action button to a panel card's Action Menu (enable it, then add an ActionData entry with an Id like ToolShowMap).", "2) Create an Event with a Control/OnClick trigger targeting that Action Id.", "3) Drop a slider-open action into the event workflow and set its Page parameter to your sliding panel's ID.", "4) Save, then Preview — clicking the button should slide the panel out from the right immediately.", "This exact recipe — button → event → slider-open action — is reused everywhere in Kinetic. A real example from Customer Entry: the 'Change ID' button has ActionData Id = Customer.ChgIDButton, and its (Locked, system) event flow is exactly Control:Customer.ChgIDButton onClick → row-update → slider-open, opening the 'Change Customer ID' panel."], "type": "SlideText", "heading": "Wiring a Sliding Panel End-to-End"}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00	\N	{}	{}	{}	read
62c77292-6f72-4810-954f-edd63d5482e8	50ea9ec9-f247-48cf-98ee-34a43cea2ede	Import/Export via Solution Workbench (2023.2)	4	[{"body": ["2023.2 formalizes exporting and importing layers through Solution Workbench, including exporting layers with parent/child relationships intact — critical for promoting a tested configuration from a sandbox to a production company cleanly."], "type": "SlideText", "heading": "Import/Export via Solution Workbench (2023.2)"}]	2026-08-12 07:16:52.495327+00	2026-08-12 07:16:52.495327+00	\N	{}	{}	{}	read
af03d1b2-d6cc-44cf-9ac6-7c449884c30a	a020390c-a9d9-4e19-918a-57bd552dcad6	ComboBox Deep Dive: Five Ways to Populate a Dropdown	0	[{"body": ["**Static List Combo** — hardcode a fixed set of options directly on the component; use for values that never change (e.g., Yes/No/Maybe).", "**BAQ Combo** — bind to a Business Activity Query; the combo runs the BAQ and lists matching rows. Great for filtered lookups like 'customers in a selected state.'", "**BO Combo (default GetList / custom method)** — call a Business Object's built-in GetList method, or point at a fully custom service method for full control over the returned rows.", "**Reusable Combo** — configure ComboId, SvcPath (e.g., `Ice.BO.UD05Svc`), ServiceMethod (`GetRows`), and TableName to bind a dropdown straight to a UD table without writing a BAQ — this is the exact pattern used for listing UD05 Service Codes on Order Entry.", "**DataView Combo / Combo in a Grid** — bind to values already loaded in another dataview, or embed a combo directly as a grid cell for inline editing."], "type": "SlideText", "proTip": "For UD-table-backed dropdowns (like custom service codes), Reusable Combo is almost always faster to set up than writing a dedicated BAQ.", "heading": "ComboBox Deep Dive: Five Ways to Populate a Dropdown"}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00	\N	{}	{}	{}	read
a7fd468e-1940-481e-afee-22a0d20a6604	a020390c-a9d9-4e19-918a-57bd552dcad6	Pickers & Date/Time Controls	1	[{"body": ["**DatePicker** and **TimePicker** bind to date/numeric columns respectively. TimePicker has handy Advanced options: Now Button, Cancel Button, Use24HourClock, and **TimeStoredAsDateTime** — which links the time value to a companion DatePicker so both edit the same underlying database column.", "**IsDecimal** on TimePicker stores time as decimal hours (e.g., 18.256 = 6:15pm) instead of seconds-since-midnight — used by scheduling boards for more precise math. **RoundToMinutes** trims seconds from the display.", "**FilePickerClient** and **FilePickerServer** let users attach files from their local machine vs. a server-side folder respectively — paired with **FileServerFolder** to define where server-side files live."], "type": "SlideText", "heading": "Pickers & Date/Time Controls"}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00	\N	{}	{}	{}	read
df481b48-b694-466a-8827-91a9fe417a74	a020390c-a9d9-4e19-918a-57bd552dcad6	Financial & ERP-Specific Components	2	[{"body": ["**GLAccountEditor**, **GLControlPanel**, and **GLMultibookAccountEditor** are purpose-built for General Ledger account entry — they understand GL account segment structure and multi-book accounting out of the box, so you never rebuild that logic yourself.", "**FiscalYearSuffix** renders the correct fiscal year suffix format for your company's calendar. **PartRevDescription** shows a part's revision + description together, exactly as seen throughout Part Maintenance. **QuantityUOM** pairs a quantity field with its unit-of-measure selector as a single control.", "**CurrencyBox** and **CurrencySelector** handle currency-formatted numeric entry and currency code selection — use them instead of a plain NumericBox anywhere money is involved so formatting stays consistent system-wide."], "type": "SlideText", "heading": "Financial & ERP-Specific Components"}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00	\N	{}	{}	{}	read
c4bad615-d18b-4e9d-9831-d8dc5bd8b662	a53f8dd7-b87b-4dab-8dbd-4fe252e3f9a1	DISTINCT Is a Tool, Not a Repair Strategy	4	[{"body": [{"text": "**DISTINCT** can be valid when identical projected rows are genuinely duplicates for the requested output. It is dangerous when it hides a many-to-many or missing-join problem.", "type": "paragraph"}, {"text": "Before using DISTINCT, inspect the fields that differ in the underlying rows and decide whether you actually need aggregation, a different join, or a different result grain.", "type": "paragraph"}], "type": "SlideText", "heading": "Know Why a Duplicate Exists"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
2d367be4-9b52-4515-af48-8bb8f5079a2f	01de9403-0222-443b-b13f-0193ef42d38b	Creating an API Key & Function Library	1	[{"body": ["Kinetic REST API v.2 requires an **API Key** on every service method call. Create one in **API Key Maintenance** (System Setup → Security Maintenance → API Key Maintenance) — give it a Key ID and Name, then save. The key value displays only once immediately after creation, so copy it right away; if you lose it, you must create a new key.", "Next, create a **Function Library** in Epicor Functions Maintenance (System Management → Business Process Management → Epicor Functions Maintenance) → New → Add Library. Give it a Library ID and Description, then go to **References/Services** and add every service your Functions inside this library will call (e.g., the Customer service for a 'create customer' Function).", "On the **Security** sheet, add every company that should be authorized to call this library via REST — a Function can only be called from an authorized company."], "type": "SlideText", "proTip": "The API Key value is shown exactly once. Save it to a secrets file or vault immediately — Kinetic will never display it again.", "heading": "Creating an API Key & Function Library"}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00	\N	{}	{}	{}	read
c02ce34e-afe1-4d27-94a5-de618257152a	01de9403-0222-443b-b13f-0193ef42d38b	Designing a Widget Function	2	[{"body": ["A **Widget Function** is created directly inside the library (New → Add Widget Function). Give it a Function ID and Description, then define its **Signature**: Request Parameters (inputs, e.g. id/name/email/notes, all typed like System.String) and Response Parameters (outputs, e.g. newID).", "Open the **Function Designer** to build the workflow: drag an **InvokeBOMethod** widget from the Callers panel (e.g., GetNewCustomer), bind its dataset parameter to a new variable, then chain **SetField** widgets to populate fields from your request parameters (e.g., set Customer.Name from the incoming `name` parameter using the C# expression editor).", "Finish the chain with another InvokeBOMethod for business logic (e.g., GetCustomerTerritory) and a final **Update** call to persist the record — then map the resulting ID field to your Function's response parameter."], "type": "SlideText", "heading": "Designing a Widget Function"}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00	\N	{}	{}	{}	read
7cf92828-b70e-4e9e-8849-077810dc9504	01de9403-0222-443b-b13f-0193ef42d38b	Calling a Function from an Event	3	[{"body": ["In the Event Designer, drag the **erp-function** action onto your workflow. Under Advanced, enter your **API Key**, select the **ERP Functions Library**, then the specific **Service Operation** (your Function's ID).", "Expand **Method Parameters** — the system reads your Function's signature automatically and lists every request parameter for you to map, either to a fixed value or a dataview column (e.g., `OrderHed.NewCustID`).", "Simple response parameters automatically populate the system **actionResult** dataview — so after the call, you can reference `actionResult.newID` in a following action (like a row-update) with zero extra wiring. For an **OnSuccess** branch, expand Behavior and add that option to only run further logic if the Function call succeeded."], "type": "SlideText", "proTip": "Simple (non-tableset) Function response parameters land automatically in the actionResult system dataview — you rarely need to configure additional response mapping.", "heading": "Calling a Function from an Event"}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00	\N	{}	{}	{}	read
28c0af68-7290-4eed-afd9-3a42047ec6be	01de9403-0222-443b-b13f-0193ef42d38b	Real Walkthrough: Making Counter Sales Easier	4	[{"body": ["This is a real, complete scenario from the official guide that ties everything together: a simplified Order Entry layer called **Counter Sale**, with a **New Customer** button that opens a sliding panel, calls a Function to create the customer on the fly, and auto-marks every order from this menu as a counter sale.", "**1) Layer + Menu**: Create a layer on Sales Order Entry, hide unnecessary fields on the Details page, save/publish it, then deploy it as a brand-new menu item (Menu Maintenance → New submenu, Program = Erp.UI.SalesOrderEntry, Customization = your layer).", "**2) Auto-mark Counter Sale orders**: A **BPM post-processing directive** on GetNewOrderHed checks if CallContext.Character01 = 'CounterSale', and if so sets OrderHed.CounterSale = true. A layer event (hooked to the system 'BeforeGetNew' event) sets that Character01 context value before the record is created.", "**3) New Customer button + sliding panel**: Add a button that opens a Sliding Panel with ID/Name/Email/Comments fields, each bound to temporary client-side bindings (e.g., `OrderHed.NewCustID`).", "**4) Wire the Function call**: An OnClick event on the panel's OK button calls your `NewCustomer` Function, maps its response (`actionResult.newID`) into the order's Customer field, triggers a `SysUpdate` event to save, then closes the panel with `slider-close`.", "The end result: clicking New Order → New Customer → filling the panel → OK creates a real customer record via server-side Function logic, auto-populates the order, and marks it as a counter sale — entirely built with events, a Function, and one BPM directive, zero custom code deployment."], "type": "SlideText", "heading": "Real Walkthrough: Making Counter Sales Easier"}]	2026-08-12 07:16:53.508051+00	2026-08-12 07:16:53.508051+00	\N	{}	{}	{}	read
a94b459e-1681-4785-a669-c5b0971bb572	8687a364-3365-4263-a994-8d3a2f1279d4	What a BAQ Is and Where It Fits	1	[{"body": [{"text": "A **Business Activity Query (BAQ)** is Epicor's reusable query layer for retrieving and shaping Kinetic data without building a custom SQL application. A BAQ can feed analysis, dashboards, App Studio DataViews, searches, reports, integrations, and REST consumers.", "type": "paragraph"}, {"text": "Think of a BAQ as a **contract for data**: what records are eligible, how tables relate, which columns are returned, what calculations are exposed, and whether callers can supply parameters.", "type": "paragraph"}, {"text": "A good BAQ is not just one that returns data. It returns the **correct grain** of data predictably and is understandable to the next developer.", "type": "paragraph"}], "type": "SlideText", "heading": "BAQ = Reusable Business Data Logic"}, {"type": "FlowDiagram", "steps": [{"label": "Business Need", "description": "Define what one result row should represent."}, {"label": "BAQ Designer", "description": "Build tables, criteria, fields, calculations, and parameters."}, {"label": "Test", "description": "Analyze and verify the actual result set."}, {"label": "Consume", "description": "Use it in UI, reports, REST, searches, or integrations."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
184874b8-66d2-4692-95d4-bd9512a80800	8687a364-3365-4263-a994-8d3a2f1279d4	Create a BAQ from Scratch	2	[{"body": [{"text": "Create a new query, enter a **Query ID** and **Description**, then decide whether it should be **Shared** and whether it needs **Cross Company** behavior. The supplied Epicor App Studio guide demonstrates this exact pattern before moving into the query builder.", "type": "paragraph"}, {"text": "After saving the shell, move to the top-level subquery, add the first table, apply criteria, choose display fields, and test the output.", "type": "paragraph"}], "type": "SlideText", "proTip": "Use a predictable naming convention such as QB_OpenOrders or Client_Process_Purpose. Names like Test1 become technical debt quickly.", "heading": "Start with the Query Definition"}, {"mode": "guided", "type": "InteractiveUI", "uiKind": "baq-designer", "sections": [{"id": "query-settings", "title": "Query Settings", "columns": 2, "elements": [{"id": "query-id", "kind": "input", "label": "Query ID", "value": "QB_ActiveCustomers"}, {"id": "query-description", "kind": "input", "label": "Description", "value": "Active customers for training"}, {"id": "shared", "kind": "toggle", "label": "Shared"}, {"id": "cross-company", "kind": "toggle", "label": "Cross Company"}], "description": "Simplified training view; labels can vary slightly by Kinetic release."}, {"id": "query-source", "title": "Query Builder", "columns": 2, "elements": [{"id": "table-name", "kind": "input", "label": "Primary Table", "value": "Erp.Customer"}, {"id": "criteria-preview", "kind": "input", "label": "Table Criteria", "value": "Customer.InActive = false"}]}, {"id": "query-output", "title": "Display Fields", "columns": 1, "elements": [{"id": "display-fields", "kind": "data-table", "rows": [{"Field": "Customer.Company", "Purpose": "Company context"}, {"Field": "Customer.CustID", "Purpose": "Customer identifier"}, {"Field": "Customer.Name", "Purpose": "Display name"}, {"Field": "Customer.City", "Purpose": "Location"}], "label": "Selected Columns", "columns": ["Field", "Purpose"]}, {"id": "get-list", "kind": "button", "label": "Analyze / Get List"}]}], "guidedSteps": [{"id": "c1", "title": "Name the BAQ", "targetId": "query-id", "instruction": "Enter a meaningful Query ID. Use a name that explains what the query returns."}, {"id": "c2", "title": "Choose visibility", "targetId": "shared", "instruction": "Enable Shared when other permitted users need to use the BAQ."}, {"id": "c3", "title": "Add the first table", "targetId": "table-name", "instruction": "Start with the table that best represents one row of the result you want."}, {"id": "c4", "title": "Add table criteria", "targetId": "criteria-preview", "instruction": "Restrict the rows before adding more complexity. In this example, only active customers are required."}, {"id": "c5", "title": "Select display fields", "targetId": "display-fields", "instruction": "Return only the fields the consumer actually needs."}, {"id": "c6", "title": "Test the query", "targetId": "get-list", "instruction": "Analyze the BAQ and run Get List. Confirm both the row count and the actual records."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
04037f97-5bff-4406-9be4-7fcbe811ac81	8687a364-3365-4263-a994-8d3a2f1279d4	Shared, Cross Company, and Updatable Are Different Decisions	3	[{"body": [{"text": "**Shared** controls whether the query is available beyond its creator, subject to security. **Cross Company** changes company scope. **Updatable** changes the query from read-oriented data retrieval into a potential write surface.", "type": "paragraph"}, {"text": "These options solve different problems. A query can be shared but single-company, cross-company but read-only, or shared and updatable.", "type": "paragraph"}, {"text": "For training and support BAQs, default to the least privilege and smallest scope that meets the requirement.", "type": "paragraph"}], "type": "SlideText", "heading": "Do Not Treat Query Flags as Defaults"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
420e7ef5-9858-430d-b54e-705125ef2ed0	a020390c-a9d9-4e19-918a-57bd552dcad6	Selection & Search Components	4	[{"body": ["**SelectionList** lets users multi-select from a custom list — the setup requires three steps: create a dataview for the list source, configure an event to populate that view, then configure the SelectionList itself to read from it.", "**SearchChipSelector** shows selected items as removable 'chips' with a search box to add more — a modern pattern for multi-value fields like tags or categories.", "**LinkComboBox** renders combo options as clickable links instead of a dropdown. **ListBox** shows a scrollable list without the dropdown behavior. **MultilevelMenu** builds nested/cascading menu structures. **Tag** shows a colored status label — OK/Warning/Stop/Global/None — the same visual language used throughout Kinetic for status indicators."], "type": "SlideText", "proTip": "Reach for Tag whenever you want a quick, consistent-looking status pill — it already matches Kinetic's built-in color conventions.", "heading": "Selection & Search Components"}]	2026-08-12 07:16:53.780434+00	2026-08-12 07:16:53.780434+00	\N	{}	{}	{}	read
aafda54c-791b-40ce-8c13-27af273b5ca2	04b6fa70-54c0-466a-ac9e-38d8b93aaeb0	Logging Into Kinetic	0	[{"body": [{"text": "Kinetic runs entirely in your **web browser** — there's nothing to install. Your administrator gives you a Kinetic URL; open it, and you'll land on the sign-in screen.", "type": "paragraph"}, {"text": "Enter your **Username** and **Password** and select **Log In**. Depending on how your organization has things configured, you may be logged in automatically via **Single Sign-On (SSO)** using your existing corporate credentials instead of a separate Epicor password.", "type": "paragraph"}, {"text": "If your account has access to more than one **Company** or **Site**, you'll be prompted to pick one after signing in — this determines which data and menu items you see for the rest of your session. You can typically switch companies later from the User Panel without logging out.", "type": "paragraph"}, {"text": "Application Studio, the subject of the rest of this course, is a Kinetic web feature — everything you'll learn here works the same way regardless of which company or site you're logged into.", "type": "paragraph"}, {"alt": "The Kinetic sign-in screen.", "src": "https://bcrovxnarohytinnqkrp.supabase.co/storage/v1/object/public/KineticUI/LoginScreen.png", "type": "image", "caption": "The Kinetic sign-in screen."}], "type": "SlideText", "proTip": "Bookmark your Kinetic URL — most organizations don't publish it anywhere obvious, so save it the first time IT gives it to you.", "heading": "Logging Into Kinetic"}]	2026-08-12 08:58:28.680761+00	2026-08-12 08:58:28.680761+00	\N	{}	{}	{}	read
9a5392c2-f381-48b5-adc3-d630f11cb8dc	04b6fa70-54c0-466a-ac9e-38d8b93aaeb0	Home Page & Navigation	1	[{"body": [{"text": "The **Home button** always brings you back to your personalized home dashboard, which can include widgets, panels, and notifications tailored to your role.", "type": "paragraph"}, {"text": "**Enterprise Search** (sometimes just called Search) is Kinetic's fast lookup — type a customer, part number, or even a screen name, and matching records or programs show up instantly, no menu digging required.", "type": "paragraph"}, {"text": "The **Menu** icon opens the left-hand navigation panel with three tabs: the full **Main Menu** tree (organized the same way Classic menus were — module → sub-module → program), **Favorites** (screens you've pinned for quick access), and **Recent** (a running history of what you've opened most recently).", "type": "paragraph"}, {"text": "The **User Panel** is where you switch **Company**, **Site/Plant**, or **Workstation**, and manage account settings — these fields can generally only be changed from the Home screen, not from inside an open program.", "type": "paragraph"}, {"text": "**Help & Support** sits at the bottom of the navigation rail and includes guided, click-through tours of the Home Page and other core screens — genuinely useful if you're brand new to the interface.", "type": "paragraph"}, {"text": "A small **connection info** indicator (visible near the User Panel) shows which database/environment and company you're currently connected to — always worth a glance before making changes, especially if your organization has multiple companies or test vs. production environments.", "type": "paragraph"}, {"alt": "The Kinetic home dashboard.", "src": "https://bcrovxnarohytinnqkrp.supabase.co/storage/v1/object/public/KineticUI/HomePage.png", "type": "image", "caption": "The Kinetic home dashboard."}, {"alt": "The Main Menu navigation panel.", "src": "https://bcrovxnarohytinnqkrp.supabase.co/storage/v1/object/public/KineticUI/MainMenu.png", "type": "image", "caption": "The Main Menu navigation panel."}], "type": "SlideText", "proTip": "Pin anything you open more than a couple of times a week to Favorites — it's almost always faster than the Main Menu tree or even Search.", "heading": "Home Page & Navigation"}]	2026-08-12 08:58:28.680761+00	2026-08-12 08:58:28.680761+00	\N	{}	{}	{}	read
c4039084-9d38-4af6-9ef5-7f355dc56164	8687a364-3365-4263-a994-8d3a2f1279d4	A Repeatable BAQ Build Checklist	4	[{"body": [{"text": "The safest workflow is incremental: define the grain, add one source table, test, add one relationship, test again, then add filters, display fields, calculations, and parameters.", "type": "paragraph"}, {"text": "When a BAQ suddenly returns ten times more rows after a new table is added, that is useful feedback. Fix the relationship before adding more logic.", "type": "paragraph"}], "type": "SlideText", "heading": "Build in Small Verified Steps"}, {"type": "FlowDiagram", "steps": [{"label": "Define Grain", "description": "What does one row mean?"}, {"label": "Add One Table", "description": "Start with the driving business entity."}, {"label": "Add One Join", "description": "Verify key fields and cardinality."}, {"label": "Add Criteria", "description": "Reduce the dataset early."}, {"label": "Select Fields", "description": "Return only what is needed."}, {"label": "Analyze", "description": "Check counts, samples, nulls, and duplicates."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
d738960f-f4fd-416c-99ff-9ae7e787aaa5	a70befb4-e471-4faa-a8e2-7248f5c47acb	Choose the Driving Table	1	[{"body": [{"text": "If one output row should represent an order, **OrderHed** is a natural driving table. If one row should represent an order line, **OrderDtl** is usually the better starting point.", "type": "paragraph"}, {"text": "Starting from the wrong grain often leads to DISTINCT, aggregation, or complicated subqueries being used to repair a design problem that began at the first table.", "type": "paragraph"}], "type": "SlideText", "heading": "Start from the Entity that Defines the Row"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
7967508a-76d8-4322-8182-26fcfd5c3ac5	a70befb4-e471-4faa-a8e2-7248f5c47acb	Use Epicor Relationships as a Starting Point	2	[{"body": [{"text": "Epicor's query tooling uses metadata and a data dictionary to help connect related tables. Treat suggested relationships as a **starting point**, not a substitute for understanding the business keys.", "type": "paragraph"}, {"text": "Always inspect the join fields. In multi-company data, **Company** is commonly part of the relationship. Omitting a key can create incorrect cross-matches or duplicates.", "type": "paragraph"}], "type": "SlideText", "proTip": "Before accepting a relationship, say the join in plain English: 'This order belongs to this customer because Company and CustNum match.'", "heading": "Suggested Relationships Still Need Review"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
881c5ae4-44ab-4860-83f3-8485154d3668	a53f8dd7-b87b-4dab-8dbd-4fe252e3f9a1	Group and Aggregate Deliberately	3	[{"body": [{"text": "Functions such as **SUM, COUNT, AVG, MIN, and MAX** compress multiple source rows into grouped results. Once aggregation is introduced, be explicit about which non-aggregated fields define the group.", "type": "paragraph"}, {"text": "A good question is: 'After grouping, what does one row represent now?' For example, one row per Customer, Part, Order, or Month.", "type": "paragraph"}, {"text": "Use aggregate subqueries when you need a summary joined back to detail without multiplying the detail rows.", "type": "paragraph"}], "type": "SlideText", "heading": "Aggregation Changes the Grain"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
9c6526d6-71b8-4fe7-94b0-74d0efb6c125	a70befb4-e471-4faa-a8e2-7248f5c47acb	Inner Join vs Left Outer Join	3	[{"body": [{"text": "Use an **inner join** when the related record must exist for the result to be valid. Use a **left outer join** when the primary row should remain even if the optional related record does not exist.", "type": "paragraph"}, {"text": "A common mistake is using an inner join to an optional table and accidentally removing valid primary rows. The opposite mistake is using outer joins everywhere and then misreading null related data.", "type": "paragraph"}], "type": "SlideText", "heading": "Join Type Controls Which Driving Rows Survive"}, {"mode": "guided", "type": "InteractiveUI", "uiKind": "baq-designer", "sections": [{"id": "join-definition", "title": "Relationship", "columns": 2, "elements": [{"id": "left-table", "kind": "input", "label": "Driving Table", "value": "OrderHed"}, {"id": "right-table", "kind": "input", "label": "Related Table", "value": "Customer"}, {"id": "join-type", "kind": "input", "label": "Join Type", "value": "Inner"}, {"id": "join-keys", "kind": "input", "label": "Join Criteria", "value": "Company + CustNum"}]}, {"id": "join-warning", "columns": 1, "elements": [{"id": "dup-warning", "kind": "callout", "text": "If row counts suddenly explode after adding a table, stop. Check relationship cardinality and join criteria before using DISTINCT as a band-aid."}]}], "guidedSteps": [{"id": "j1", "title": "Identify the driving table", "targetId": "left-table", "instruction": "Decide what one row of your intended output represents. That table usually drives the query."}, {"id": "j2", "title": "Add the related table", "targetId": "right-table", "instruction": "Add only the table needed for the next piece of information."}, {"id": "j3", "title": "Choose the join type", "targetId": "join-type", "instruction": "Use an inner join when the related row must exist; use a left outer join when the driving row should survive even without a match."}, {"id": "j4", "title": "Verify the key fields", "targetId": "join-keys", "instruction": "Confirm company and business keys are included so unrelated rows do not multiply the result."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
5ef1ed12-d5c2-41d7-9e0a-4f63ad74bd01	a70befb4-e471-4faa-a8e2-7248f5c47acb	Prevent Duplicate Multiplication	4	[{"body": [{"text": "When a header is joined to many detail rows, the header naturally repeats once per detail. When two independent one-to-many tables are joined at the same level, the result can multiply even further.", "type": "paragraph"}, {"text": "Do not reach for **DISTINCT** first. Decide whether the detail belongs in the row grain, whether it should be aggregated in a subquery, or whether another relationship is missing.", "type": "paragraph"}, {"text": "The BPM Cookbook also stresses using sensible joins and filters, including indexed fields, to keep query processing efficient.", "type": "paragraph"}], "type": "SlideText", "heading": "Duplicates Usually Have a Reason"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
716a625b-ea1f-40fb-86fe-77ecd197e0c3	60dc6b61-7384-4789-9004-ede022fa9f44	Add Table Criteria	1	[{"body": [{"text": "Table criteria restrict which rows from a table participate in the query. The supplied App Studio guide shows a BAQ filtering **Ice.Menu.Arguments** with a LIKE condition before selecting display fields.", "type": "paragraph"}, {"text": "Typical criteria compare a field to a constant, another field, or a parameter. Use the data type and operator that match the business rule.", "type": "paragraph"}], "type": "SlideText", "proTip": "If a query only needs open orders, filter to open orders instead of returning everything and asking every consumer to filter later.", "heading": "Filter as Close to the Source as Possible"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
ca19a300-4907-453d-9c0b-7afb2114309c	60dc6b61-7384-4789-9004-ede022fa9f44	AND, OR, and Grouping Logic	2	[{"body": [{"text": "A filter such as `OpenOrder = true AND (Customer = A OR Customer = B)` is not equivalent to `(OpenOrder = true AND Customer = A) OR Customer = B`.", "type": "paragraph"}, {"text": "When multiple criteria are involved, write the requirement in plain English first, then mirror the intended grouping in the BAQ criteria.", "type": "paragraph"}, {"text": "Test edge cases, especially null values and records that satisfy only one branch of an OR condition.", "type": "paragraph"}], "type": "SlideText", "heading": "Boolean Logic Is Part of the Requirement"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
761f8121-a9da-4cc4-bb9f-9a5a83eec3ad	60dc6b61-7384-4789-9004-ede022fa9f44	Create and Use BAQ Parameters	3	[{"body": [{"text": "Epicor describes BAQs as supporting **parameter-driven queries**. Instead of hard-coding a customer, date, plant, or status, define a named parameter and reference it in the query criteria.", "type": "paragraph"}, {"text": "A practical parameter definition includes a clear name, a matching data type, and a learner-friendly prompt. Depending on Kinetic release and parameter type, additional options may be available.", "type": "paragraph"}, {"text": "When testing, use realistic values and test empty/optional behavior if the parameter design allows it.", "type": "paragraph"}], "type": "SlideText", "heading": "Parameters Make the BAQ Reusable"}, {"mode": "guided", "type": "InteractiveUI", "uiKind": "baq-designer", "sections": [{"id": "parameter-definition", "title": "Parameter Definition", "columns": 2, "elements": [{"id": "parameter-name", "kind": "input", "label": "Parameter Name", "value": "pCustomerID"}, {"id": "parameter-type", "kind": "input", "label": "Data Type", "value": "nvarchar"}, {"id": "parameter-prompt", "kind": "input", "label": "Prompt", "value": "Customer ID"}, {"id": "test-value", "kind": "input", "label": "Test Value", "value": "ABC"}]}, {"id": "parameter-criteria", "title": "Criteria Using the Parameter", "columns": 1, "elements": [{"id": "criteria-table", "kind": "data-table", "rows": [{"Field": "Customer.CustID", "Value": "pCustomerID", "Operation": "=", "Value Source": "Parameter"}], "label": "Table Criteria", "columns": ["Field", "Operation", "Value Source", "Value"]}, {"id": "parameter-tip", "kind": "callout", "text": "Use parameters when the filter value should be supplied at runtime. Use constants when the rule is fixed by design."}]}], "guidedSteps": [{"id": "p1", "title": "Create the parameter", "targetId": "parameter-name", "instruction": "Define a named parameter that represents the value the user or caller will supply."}, {"id": "p2", "title": "Match the data type", "targetId": "parameter-type", "instruction": "Choose a parameter data type that matches the field you will compare against."}, {"id": "p3", "title": "Reference it in criteria", "targetId": "criteria-table", "instruction": "Use the parameter as the filter value instead of hard-coding a constant."}, {"id": "p4", "title": "Test with a realistic value", "targetId": "test-value", "instruction": "Enter a test value and confirm the returned rows match the intended business rule."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
e364ce34-d5bc-4915-b872-50963956fb61	60dc6b61-7384-4789-9004-ede022fa9f44	Value Lists and Date Parameters	4	[{"body": [{"text": "The supplied Epicor REST Services guide documents two important behaviors: **date parameters use ISO-style values** such as `2026-08-12`, and a **value-list parameter** can be passed multiple times using the same parameter name.", "type": "paragraph"}, {"text": "For example, a list parameter can conceptually be supplied as `pStatus=Open&pStatus=Closed`. This makes one BAQ reusable for multi-select integration scenarios.", "type": "paragraph"}, {"text": "Design the parameter contract before building the UI so the consumer knows whether it sends one value, many values, or an optional value.", "type": "paragraph"}], "type": "SlideText", "heading": "Parameter Shape Matters to the Caller"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
2743303f-8b90-44cb-b5ee-04d09b2fe6b0	60dc6b61-7384-4789-9004-ede022fa9f44	Runtime Filters vs BAQ Parameters	5	[{"body": [{"text": "A **BAQ parameter** is part of the BAQ's own query contract. A **runtime filter** can be applied by a consuming layer such as App Studio or REST after or during execution, depending on the mechanism.", "type": "paragraph"}, {"text": "The REST guide explicitly supports both custom BAQ parameters and OData `$filter`. In App Studio, BAQ DataView options can also build dynamic filters from current screen values.", "type": "paragraph"}, {"text": "Use BAQ parameters for reusable query intent; use consumer-side filters for context that belongs to the consuming screen or integration.", "type": "paragraph"}], "type": "SlideText", "heading": "Do Not Confuse Two Different Filtering Layers"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
eccee75e-0324-4213-85db-eeaadea68fcf	a53f8dd7-b87b-4dab-8dbd-4fe252e3f9a1	Select Only Useful Display Fields	1	[{"body": [{"text": "Display fields become the columns consumers see. Select keys needed for identity, fields needed by the UI/report/integration, and calculated values that carry business meaning.", "type": "paragraph"}, {"text": "Avoid returning every available field. Smaller, intentional outputs are easier to understand, safer to expose, and easier to consume.", "type": "paragraph"}, {"text": "The supplied App Studio guide demonstrates explicitly moving required fields into the BAQ's Display Fields list.", "type": "paragraph"}], "type": "SlideText", "heading": "The BAQ Output Is an Interface"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
ada92e7d-4f4d-40d9-afc5-f274d08854d5	83014076-c3bb-49b5-a31e-388e14614ad7	Understand the Top-Level Subquery	1	[{"body": [{"text": "A BAQ is organized around subqueries. The top-level subquery is the final layer returned to the consumer, while inner or supporting subqueries can prepare data before it reaches that final output.", "type": "paragraph"}, {"text": "The supplied App Studio guide explicitly walks through selecting **SubQuery:TopLevel** before adding the first table.", "type": "paragraph"}], "type": "SlideText", "heading": "The Top Level Produces the Final Result"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
6438e3a2-d8a1-411e-ac0d-ea1f6ece49b7	83014076-c3bb-49b5-a31e-388e14614ad7	Use an Aggregate Subquery to Prevent Multiplication	2	[{"body": [{"text": "If a shipment has many detail lines but you need one shipment-level freight total, calculate the total in a subquery grouped by the shipment key, then join that single summarized row back to the main query.", "type": "paragraph"}, {"text": "This is one of the most useful BAQ patterns because it prevents repeating header-level amounts across multiple detail rows.", "type": "paragraph"}], "type": "SlideText", "proTip": "When a value belongs to a higher level than your output rows, ask whether it should be aggregated separately before the join.", "heading": "Summarize Before You Join"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
f215c676-6897-495d-81fa-2fffcc6f60c7	83014076-c3bb-49b5-a31e-388e14614ad7	Union and Union-All Concepts	3	[{"body": [{"text": "Union-style subqueries combine rows from separate query branches that expose compatible columns. This is useful when the business result represents the same conceptual record coming from different sources.", "type": "paragraph"}, {"text": "Use the technique only when the output columns have compatible meaning and data types. Do not use a union to avoid understanding a relationship.", "type": "paragraph"}, {"text": "Exact subquery options can vary by Kinetic release, so teach the concept first and confirm the available designer option in the customer's version.", "type": "paragraph"}], "type": "SlideText", "heading": "Combine Compatible Result Sets"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
66089ca1-bec8-4015-9952-041a0ecaa6d6	83014076-c3bb-49b5-a31e-388e14614ad7	Recursive Queries and SQL-to-BAQ Generator	4	[{"body": [{"text": "Epicor's current BAQ product information highlights **recursive queries** for hierarchical relationships and **nested calculations** for advanced data shaping.", "type": "paragraph"}, {"text": "Epicor also introduced a **SQL to BAQ Generator** in Kinetic 2024.1 that can translate SQL into BAQ structures, including complex joins and subqueries. Treat this as an accelerator, not an excuse to skip validation.", "type": "paragraph"}, {"text": "If the feature is not present in the customer's release, build the BAQ manually using the same underlying design principles.", "type": "paragraph"}], "type": "SlideText", "heading": "Know the Advanced Tools, but Use Them Purposefully"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3b1ff270-1a20-4ee7-bc19-1c428b06a753	764e0095-d566-4915-b785-8e2051709d97	Analyze and Get List	1	[{"body": [{"text": "A syntactically valid BAQ can still be logically wrong. Use the Analyze area and **Get List** to inspect actual rows, as demonstrated in the supplied BPM Cookbook.", "type": "paragraph"}, {"text": "Validate expected records, missing records, duplicates, nulls, edge cases, and row counts. For parameterized BAQs, test several parameter values, not just the happy path.", "type": "paragraph"}], "type": "SlideText", "heading": "Test the Data, Not Just the Syntax"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
8b1816e3-e0e6-4b74-9b85-dd0556abe0b3	764e0095-d566-4915-b785-8e2051709d97	Security IDs and Query Access	2	[{"body": [{"text": "Epicor's official training material shows that a custom BAQ can be assigned a **Security ID**, and only users with access through that security configuration can display the query's data.", "type": "paragraph"}, {"text": "Design security around the sensitivity of the returned data, especially for financial, HR, pricing, or cross-company queries.", "type": "paragraph"}], "type": "SlideText", "heading": "Shared Does Not Mean Unrestricted"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
031f64f5-63fa-405e-b09a-a892d4aa52ec	764e0095-d566-4915-b785-8e2051709d97	Performance Starts with Query Shape	3	[{"body": [{"text": "Performance is strongly affected by how many rows are scanned, how tables are joined, and whether filters use meaningful indexed fields. The supplied BPM Cookbook specifically calls out table joins and filters as important to performance.", "type": "paragraph"}, {"text": "Practical habits: apply selective criteria early, avoid unnecessary tables and fields, avoid accidental many-to-many joins, aggregate at the correct level, and test with realistic data volumes.", "type": "paragraph"}, {"text": "Epicor's current BAQ materials also reference query activity/performance monitoring, which is useful when a BAQ becomes a shared production dependency.", "type": "paragraph"}], "type": "SlideText", "heading": "Reduce Work Before You Optimize Syntax"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
31c553d1-cdc0-44df-bc78-2b600b35b066	764e0095-d566-4915-b785-8e2051709d97	Safe Promotion Checklist	4	[{"body": [{"text": "Confirm naming, description, company scope, security, parameters, expected row grain, edge cases, performance, and consumers. For UBAQs, also verify update permissions, validation, multi-row behavior, and error handling.", "type": "paragraph"}, {"text": "Document where the BAQ is consumed. A harmless-looking field rename can break App Studio, reports, REST clients, or Excel connections.", "type": "paragraph"}], "type": "SlideText", "heading": "Before a BAQ Becomes Production Infrastructure"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
4e55a547-3b14-41f3-8990-03d8b79ccc79	5162aad4-ba6c-4d9f-8371-95651c0f4388	Create a BAQ-Backed DataView	1	[{"body": [{"text": "Epicor Application Studio can integrate BAQ data directly into user interfaces. A BAQ-backed DataView lets the screen consume query results without duplicating the query logic in the UI.", "type": "paragraph"}, {"text": "Keep the BAQ responsible for reusable data logic and the layer responsible for screen context, interaction, and presentation.", "type": "paragraph"}], "type": "SlideText", "heading": "Bring BAQ Data into Application Studio"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3b47c77a-6a97-4e38-b268-98d2dae1d445	5162aad4-ba6c-4d9f-8371-95651c0f4388	Populate a Grid with BAQ Results	2	[{"body": [{"text": "Once the BAQ-backed DataView is configured, bind grid columns to the fields returned by the BAQ. The BAQ's Display Fields define what the UI can bind to.", "type": "paragraph"}, {"text": "Use readable column titles and hide technical keys only when the UI does not need to display them.", "type": "paragraph"}], "type": "SlideText", "heading": "Bind the Grid to the DataView"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3bbc10f9-9fee-4087-bfd2-ba1825470cd1	5162aad4-ba6c-4d9f-8371-95651c0f4388	Dynamic BAQ Filters from Screen Values	3	[{"body": [{"text": "The supplied Kinetic training documents demonstrate BAQ DataView filters built from current screen values. This pattern is useful when the same BAQ must return different rows as the user moves through orders, parts, customers, or plants.", "type": "paragraph"}, {"text": "Build the filter from known DataView values and refresh at the correct event. Avoid hard-coding values that already exist in the screen context.", "type": "paragraph"}], "type": "SlideText", "heading": "Let the Screen Supply Context"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
ad358263-3386-44d9-b54e-761593d3c71d	5162aad4-ba6c-4d9f-8371-95651c0f4388	Parent-Child BAQ DataViews	4	[{"body": [{"text": "A common pattern is a parent view that establishes context and a child BAQ DataView filtered by the current parent's key. For example, selected OrderNum drives an order-lines BAQ.", "type": "paragraph"}, {"text": "Refresh the child only after the parent key is available. Clear or reload child rows when the parent changes.", "type": "paragraph"}], "type": "SlideText", "heading": "Refresh Child Data from the Parent Key"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
b6a2032d-5fd7-42a3-b1d1-ce90565210d6	5162aad4-ba6c-4d9f-8371-95651c0f4388	Avoid Double Filtering Confusion	5	[{"body": [{"text": "A BAQ can already contain fixed criteria and parameters, while the DataView can add runtime filters. Document which layer owns each rule so developers do not accidentally apply the same restriction twice or create contradictory filters.", "type": "paragraph"}, {"text": "If a rule is universally true for every consumer, it usually belongs in the BAQ. If it exists only because of the current screen state, it often belongs in the consuming layer.", "type": "paragraph"}], "type": "SlideText", "heading": "Know Which Layer Owns Each Rule"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
52dc5de2-98c8-4fb1-b69c-eda8eecb182c	2db3a3e6-3353-4930-bc26-90c28f2890ef	Populate a Combo from a BAQ	1	[{"body": [{"text": "A BAQ-backed combo is useful when the option list depends on ERP data, multiple fields, custom calculations, or filters that a static list cannot express.", "type": "paragraph"}, {"text": "Return a stable value field and a readable display field. Keep the result set reasonably small.", "type": "paragraph"}], "type": "SlideText", "heading": "Use a BAQ When Combo Options Need Business Logic"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
4e8e25fe-27fd-4db1-824b-893404ecefd3	2db3a3e6-3353-4930-bc26-90c28f2890ef	Filter a Combo with Current Values	2	[{"body": [{"text": "The supplied training documents show filterable BAQ combos where values from the current screen are injected into the BAQ filter. For example, selected OrderNum and PartNum can constrain the available OrderLine values.", "type": "paragraph"}, {"text": "Refresh the combo when any dependency changes, and clear a previously selected value if it is no longer valid.", "type": "paragraph"}], "type": "SlideText", "heading": "Runtime Context Makes Combos Useful"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
b16334c3-dc94-407e-9b1f-79364089bf78	2db3a3e6-3353-4930-bc26-90c28f2890ef	Build Cascading BAQ Combos	3	[{"body": [{"text": "A cascading design might be Customer → Order → Line. Each combo supplies a value used to filter the next BAQ-backed combo.", "type": "paragraph"}, {"text": "Do not load every possible downstream value at startup. Load only what the current upstream selection allows.", "type": "paragraph"}], "type": "SlideText", "heading": "Each Selection Narrows the Next"}, {"type": "FlowDiagram", "steps": [{"label": "Customer", "description": "Select customer."}, {"label": "Order BAQ", "description": "Filter orders by customer."}, {"label": "Order", "description": "Select order."}, {"label": "Line BAQ", "description": "Filter lines by order."}, {"label": "Line", "description": "Select valid line."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
1d4b2ba4-8bbd-419d-9e03-971124e441ac	2db3a3e6-3353-4930-bc26-90c28f2890ef	Use erp-baq Events Intentionally	4	[{"body": [{"text": "In App Studio, BAQ execution can be triggered from configured events. Decide whether the query should run on load, after a field changes, when a button is clicked, or after another service call completes.", "type": "paragraph"}, {"text": "Avoid repeated executions on noisy events. If the same BAQ is firing several times while the user makes one change, inspect the event chain.", "type": "paragraph"}], "type": "SlideText", "heading": "Execution Is an Event, Not Magic"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3ac4d60c-1fcb-4053-991b-61eb0982b61b	0806b353-5ad0-4fd8-b2be-58166fdced4a	When a BAQ Should Be Updatable	1	[{"body": [{"text": "Epicor states that **Updatable BAQs** can make real-time changes to live data. That makes a UBAQ fundamentally different from a reporting BAQ.", "type": "paragraph"}, {"text": "Use a UBAQ when users need a focused grid or workflow for controlled updates and the update path can preserve Epicor's business rules. Do not use it merely because editing a grid looks convenient.", "type": "paragraph"}], "type": "SlideText", "proTip": "If you cannot clearly explain the validation, transaction, and error behavior, the BAQ is not ready to be made updatable.", "heading": "UBAQs Are Write Interfaces"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
1bc7e32e-3d2e-42e8-8319-c9372c0328f3	0806b353-5ad0-4fd8-b2be-58166fdced4a	Enable Updatable and Choose Editable Fields	2	[{"body": [{"text": "The BPM Cookbook's UBAQ example starts by enabling **Updatable**, then configures Update properties and identifies which fields are editable.", "type": "paragraph"}, {"text": "Do not expose business keys or sensitive fields for editing unless the workflow specifically requires it. Read-only context fields can still be returned to help users understand the row.", "type": "paragraph"}], "type": "SlideText", "heading": "Expose the Minimum Write Surface"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
1c27f439-2db4-47ad-b470-0ee0ed456273	0806b353-5ad0-4fd8-b2be-58166fdced4a	Allow New Record and Multiple Row Update	3	[{"body": [{"text": "The supplied BPM Cookbook demonstrates settings such as **Allow Multiple Row Update** and **Allow New Record**. These options change how the UBAQ behaves and should match the business transaction.", "type": "paragraph"}, {"text": "A mass-maintenance process may need multiple-row update. A focused editor may intentionally allow only one row. A selection/action UBAQ may explicitly disable new records.", "type": "paragraph"}], "type": "SlideText", "heading": "Row Scope Is a Business Decision"}, {"mode": "guided", "type": "InteractiveUI", "uiKind": "form", "sections": [{"id": "update-general", "title": "Update Settings", "columns": 2, "elements": [{"id": "updatable", "kind": "toggle", "label": "Updatable"}, {"id": "multi-row", "kind": "toggle", "label": "Allow Multiple Row Update"}, {"id": "allow-new", "kind": "toggle", "label": "Allow New Record"}, {"id": "update-mode", "kind": "input", "label": "Update Processing", "value": "Advanced BPM Update Only"}]}, {"id": "update-fields", "title": "Editable Intent", "columns": 1, "elements": [{"id": "updatable-field", "kind": "data-table", "rows": [{"Field": "Calculated_Select", "Purpose": "User selects rows to process", "Editable": "Yes"}, {"Field": "Part_PartNum", "Purpose": "Business key", "Editable": "No"}, {"Field": "Calculated_ErrorMessage", "Purpose": "Return processing feedback", "Editable": "No"}], "label": "Fields", "columns": ["Field", "Editable", "Purpose"]}, {"id": "error-field", "kind": "callout", "text": "A calculated checkbox can capture user intent without directly editing the underlying business key. BPM logic can then process only the selected rows."}]}], "guidedSteps": [{"id": "u1", "title": "Enable updates", "targetId": "updatable", "instruction": "Mark the BAQ as Updatable only when the query is intentionally designed to write data."}, {"id": "u2", "title": "Choose editable fields", "targetId": "updatable-field", "instruction": "Expose the smallest possible set of fields that users are allowed to change."}, {"id": "u3", "title": "Decide row scope", "targetId": "multi-row", "instruction": "Allow multiple-row update only when the business transaction supports it safely."}, {"id": "u4", "title": "Choose update processing", "targetId": "update-mode", "instruction": "Use standard/direct processing for straightforward mapped updates; use BPM processing when custom validation or orchestration is required."}, {"id": "u5", "title": "Plan error feedback", "targetId": "error-field", "instruction": "Return useful error information to the row so the learner understands which record failed and why."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
0e231d7c-ccaf-4b3e-8fc1-2f9792e33d64	0806b353-5ad0-4fd8-b2be-58166fdced4a	Direct Update vs BPM Update Processing	4	[{"body": [{"text": "Straightforward field updates may be handled through standard UBAQ update mapping. More complex cases need custom processing, validation, calls to business objects, or multi-table orchestration.", "type": "paragraph"}, {"text": "The BPM Cookbook demonstrates **Advanced BPM Update Only** and a Base Processing directive for a custom delete workflow. This is appropriate when the query's update operation represents a business action rather than a simple field assignment.", "type": "paragraph"}], "type": "SlideText", "heading": "Choose the Simplest Safe Update Path"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
d4dc1947-240f-4e8c-9365-a2e333fe517b	0806b353-5ad0-4fd8-b2be-58166fdced4a	Calculated Fields as User Intent	5	[{"body": [{"text": "The BPM Cookbook uses a calculated bit field such as **DeleteRecord** to capture user intent. The field does not represent a database column; it tells the update BPM which rows the user selected for processing.", "type": "paragraph"}, {"text": "This pattern is powerful for actions like Process, Approve, Recalculate, Clear, Send, or Delete, provided the BPM performs the real business operation safely.", "type": "paragraph"}], "type": "SlideText", "heading": "A Checkbox Can Mean 'Perform This Action'"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3c9f621d-ece4-4b17-a2bd-b8f09dc3285f	ad8796d8-2e79-4e61-9ec2-a08859f3f263	Base Processing Directive Pattern	1	[{"body": [{"text": "For advanced processing, configure the UBAQ's Update method and create a **Base Processing** directive. The BPM receives the query result dataset and can act on changed or selected rows.", "type": "paragraph"}, {"text": "The supplied BPM Cookbook demonstrates this pattern for deleting selected Part records through the Part business object rather than issuing raw database deletes.", "type": "paragraph"}], "type": "SlideText", "heading": "The UBAQ Update Method Can Have BPM Logic"}, {"type": "FlowDiagram", "steps": [{"label": "User Changes Row", "description": "The result row is marked changed."}, {"label": "UBAQ Update", "description": "The UBAQ Update method receives the dataset."}, {"label": "Base Processing BPM", "description": "Validate and build the business-object request."}, {"label": "Business Object", "description": "Execute supported ERP update logic."}, {"label": "Return Feedback", "description": "Map errors/results back to the query rows."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
0abdff2a-952b-4ea5-8e2f-5587d0a53070	ad8796d8-2e79-4e61-9ec2-a08859f3f263	Changed Rows, RowMod, and Selection	2	[{"body": [{"text": "Updatable datasets use row state/RowMod behavior to identify changed rows. For action-style UBAQs, combine that with a calculated selection field so the BPM can distinguish 'edited' from 'selected for processing'.", "type": "paragraph"}, {"text": "Do not blindly loop every returned row when the user's action only concerns changed or selected rows.", "type": "paragraph"}], "type": "SlideText", "heading": "Understand Which Rows the BPM Should Process"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
b1aecef4-801e-4e12-bac0-1ce7b269d727	ad8796d8-2e79-4e61-9ec2-a08859f3f263	Return Errors to the Correct Row	3	[{"body": [{"text": "The BPM Cookbook example maps business-object errors back to the originating query row using identifiers such as **SysRowID** and exposes the text through a calculated error field.", "type": "paragraph"}, {"text": "This is better than returning one generic failure after a 50-row update because the user can see exactly which row failed and why.", "type": "paragraph"}], "type": "SlideText", "heading": "Error Handling Is Part of the User Experience"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
de1d155d-7626-4fe5-b8c7-8e848f3b8cf2	ad8796d8-2e79-4e61-9ec2-a08859f3f263	Transaction and Rollback Thinking	4	[{"body": [{"text": "For multi-row processing, define whether one bad row should stop everything or whether valid rows may succeed while failed rows return errors. This is a business rule, not merely a technical preference.", "type": "paragraph"}, {"text": "Match UBAQ update options, BPM logic, and called business-object behavior to the chosen transaction policy. Test failure cases deliberately.", "type": "paragraph"}], "type": "SlideText", "heading": "Decide What Partial Success Means"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
263e84bc-a69e-493a-af77-5d465adadefa	8d8c67b9-1f1a-471b-ba12-c969e0f8540f	Understand the BAQ Report Pipeline	1	[{"body": [{"text": "A BAQ Report uses BAQ data as the reporting dataset and can then be presented through a report definition/layout. Epicor provides tooling to deploy BAQ reports as Kinetic applications and add them to the menu.", "type": "paragraph"}, {"text": "Build and validate the BAQ first. Report layout problems are much easier to solve when the dataset is already correct.", "type": "paragraph"}], "type": "SlideText", "heading": "BAQ Data Can Become a Formal Report"}, {"type": "FlowDiagram", "steps": [{"label": "BAQ", "description": "Return the correct dataset."}, {"label": "BAQ Report", "description": "Define report parameters and report data."}, {"label": "Layout", "description": "Format the report output."}, {"label": "Deploy", "description": "Expose the report through Kinetic/menu configuration."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
3ff2eabc-9646-4f27-972a-b53872217c5c	8d8c67b9-1f1a-471b-ba12-c969e0f8540f	Report Parameters and BAQ Filters	2	[{"body": [{"text": "A report can collect user selections while the underlying BAQ also has criteria or parameters. Design the pipeline so each report prompt has a clear path into the data retrieval logic.", "type": "paragraph"}, {"text": "Avoid duplicating the same filter in several layers unless there is a specific reason.", "type": "paragraph"}], "type": "SlideText", "heading": "Know Where the Prompt Belongs"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
0091ae73-c0c0-4f6d-bbf2-1c46630cfb55	8d8c67b9-1f1a-471b-ba12-c969e0f8540f	Multi-Select Values and Delimiters	3	[{"body": [{"text": "The supplied training material includes BAQ Report work involving multi-select values and delimiter handling. When a UI returns several selected values as one string, the receiving logic must know the delimiter and split/rebuild the values consistently.", "type": "paragraph"}, {"text": "Test zero selections, one selection, multiple selections, and values that might contain punctuation.", "type": "paragraph"}], "type": "SlideText", "heading": "Multi-Select Inputs Need an Agreed Format"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
ca051a28-8764-4aec-bf48-0e3bc689baa8	8d8c67b9-1f1a-471b-ba12-c969e0f8540f	Deploy BAQ Reports in Kinetic	4	[{"body": [{"text": "Epicor's official Kinetic video library shows BAQ reports can be previewed/deployed as Kinetic applications and added to the menu through Menu Maintenance.", "type": "paragraph"}, {"text": "Deployment is the final step after dataset, parameters, security, and layout are tested.", "type": "paragraph"}], "type": "SlideText", "heading": "Make the Report Discoverable"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
7da4ecde-e81e-4c76-b303-2725967e571f	e3e09f86-4c23-4652-b90f-4bb72214a27a	BAQ REST Endpoint Concept	1	[{"body": [{"text": "Epicor REST Services exposes BAQ data through BAQ service endpoints. The caller identifies the company and BAQ Query ID, then retrieves the BAQ data through HTTP.", "type": "paragraph"}, {"text": "Because external consumers can depend on the result shape, treat field names, types, and parameters as an API contract.", "type": "paragraph"}], "type": "SlideText", "heading": "A BAQ Can Be an Integration Contract"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
425be235-faa9-42f0-8f09-37550a266905	e3e09f86-4c23-4652-b90f-4bb72214a27a	Pass BAQ Parameters through REST	2	[{"body": [{"text": "The supplied Epicor REST Services guide documents executing a BAQ with custom parameters appended to the BAQ Data endpoint. Date parameters use ISO-formatted values, and value-list parameters can repeat.", "type": "paragraph"}, {"text": "URL-encode values correctly and do not build unsafe query strings by concatenating untrusted text.", "type": "paragraph"}], "type": "SlideText", "heading": "Custom Parameters Travel in the Query String"}, {"mode": "guided", "type": "InteractiveUI", "uiKind": "form", "sections": [{"id": "rest-request", "title": "Request Builder", "columns": 2, "elements": [{"id": "baq-id", "kind": "input", "label": "BAQ ID", "value": "QB_OpenOrders"}, {"id": "baq-parameter", "kind": "input", "label": "Custom Parameter", "value": "pCustID=ABC"}, {"id": "odata-filter", "kind": "input", "label": "OData Filter", "value": "$filter=OrderHed_OpenOrder eq true"}, {"id": "rest-method", "kind": "input", "label": "Method", "value": "GET"}]}, {"id": "rest-help", "columns": 1, "elements": [{"id": "rest-note", "kind": "callout", "text": "For value-list BAQ parameters, the REST guide shows the same parameter name repeated for each value. Date parameters should use ISO format such as 2026-08-12."}]}], "guidedSteps": [{"id": "r1", "title": "Choose the BAQ", "targetId": "baq-id", "instruction": "Use the Query ID as the BAQ resource name."}, {"id": "r2", "title": "Pass BAQ parameters", "targetId": "baq-parameter", "instruction": "Add custom BAQ parameters to the query string using the parameter name defined in the BAQ."}, {"id": "r3", "title": "Apply an OData filter", "targetId": "odata-filter", "instruction": "Use $filter for an additional result filter when appropriate."}, {"id": "r4", "title": "Use REST formatting rules", "targetId": "rest-note", "instruction": "Use ISO-formatted date parameters and repeat a value-list parameter name when multiple values are required."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
99016a0d-e7d5-458b-b86a-4175109d5b20	e3e09f86-4c23-4652-b90f-4bb72214a27a	Use OData $filter on BAQ Results	3	[{"body": [{"text": "Epicor's REST guide also documents applying OData **$filter** to BAQ results. This is separate from the BAQ's own criteria and custom parameters.", "type": "paragraph"}, {"text": "Keep the BAQ reusable, but do not push critical security or universal business rules into a client-controlled filter.", "type": "paragraph"}], "type": "SlideText", "heading": "REST Adds Another Filtering Layer"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
73e59bca-83cf-4627-95e5-6171c7779231	e3e09f86-4c23-4652-b90f-4bb72214a27a	Create, Update, and Delete with UBAQ REST	4	[{"body": [{"text": "The supplied Epicor REST Services guide includes workflows for **creating, updating, and deleting** records through Updatable BAQs.", "type": "paragraph"}, {"text": "Before exposing write operations externally, verify authentication, API permissions, BAQ security, update validation, allowed fields, error handling, and idempotency expectations.", "type": "paragraph"}], "type": "SlideText", "heading": "UBAQs Extend REST Beyond Reading"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
75ed1098-0b78-4f72-a2c1-a6df1b65a4ec	e3e09f86-4c23-4652-b90f-4bb72214a27a	BAQs as Stable Integration Interfaces	5	[{"body": [{"text": "Integrations often fail because a field was renamed, a calculation changed type, or a filter silently changed. Treat BAQ changes like API changes: review downstream consumers and test representative requests.", "type": "paragraph"}, {"text": "For major incompatible changes, consider a new BAQ version/ID and migrate consumers deliberately.", "type": "paragraph"}], "type": "SlideText", "heading": "Version Your Thinking Even If the BAQ ID Stays the Same"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
2fadbcdf-f9c9-41e0-af4f-010fb1f556b9	7bdf94f5-9009-420c-ac5f-10975d1bea60	Lab 1 - Build an Active Customer BAQ	1	[{"body": [{"text": "Create a read-only shared BAQ from **Erp.Customer** that returns active customers with Company, CustID, Name, City, and State.", "type": "paragraph"}, {"text": "Add a fixed criterion for active records. Analyze the query and verify several known customers. Then explain what one row represents.", "type": "paragraph"}], "type": "SlideText", "heading": "Goal"}, {"type": "FlowDiagram", "steps": [{"label": "Create", "description": "Query ID + description."}, {"label": "Add Customer", "description": "Use Customer as the driving table."}, {"label": "Filter", "description": "Only active rows."}, {"label": "Display", "description": "Select the required output fields."}, {"label": "Test", "description": "Analyze/Get List and verify records."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
8d1d7373-db66-4d55-b347-4cc6686cf1d1	7bdf94f5-9009-420c-ac5f-10975d1bea60	Lab 2 - Orders with Customer Name	2	[{"body": [{"text": "Build an order-header BAQ using **OrderHed** joined to **Customer**. Return OrderNum, OrderDate, CustID/Name, and OpenOrder.", "type": "paragraph"}, {"text": "Explain why the relationship needs the correct company/customer key fields. Then change the relationship conceptually from inner to left outer and predict how unmatched data would behave before testing.", "type": "paragraph"}], "type": "SlideText", "heading": "Goal"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
68d42ede-bb23-4097-93cd-815bdb5d93db	7bdf94f5-9009-420c-ac5f-10975d1bea60	Lab 3 - Parameterized Open Orders	3	[{"body": [{"text": "Add a customer parameter such as **pCustomerID** to the order BAQ. Use it in criteria so the same query can return open orders for different customers.", "type": "paragraph"}, {"text": "Test at least two valid customer IDs and one ID with no open orders. Record the expected vs actual row counts.", "type": "paragraph"}], "type": "SlideText", "heading": "Goal"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
ea7a938f-3784-40cc-bf4a-ed3a7d84c91c	7bdf94f5-9009-420c-ac5f-10975d1bea60	Lab 4 - Aggregate Shipment Value without Duplication	4	[{"body": [{"text": "Build a detail-level result that needs one shipment-level total. Create a grouped supporting subquery at shipment level and join the summarized value back to the detail query.", "type": "paragraph"}, {"text": "Verify that the total is not multiplied when a shipment contains several detail rows. Explain the grain of both the detail query and the aggregate subquery.", "type": "paragraph"}], "type": "SlideText", "heading": "Goal"}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
62b44969-cb74-46ed-a807-2ac4757184f0	7bdf94f5-9009-420c-ac5f-10975d1bea60	Final Challenge - Read, Update, and Integrate	5	[{"body": [{"text": "Create a small BAQ solution with three parts: **(1)** a read-only parameterized BAQ, **(2)** a controlled UBAQ action using an editable calculated selection field, and **(3)** one consumer such as App Studio or REST.", "type": "paragraph"}, {"text": "Document the grain, tables, joins, criteria, parameters, display fields, update behavior, security, test cases, and consumer contract.", "type": "paragraph"}, {"text": "The deliverable is not just a working query. It is a BAQ another developer can safely understand, test, and maintain.", "type": "paragraph"}], "type": "SlideText", "heading": "Capstone"}, {"type": "FlowDiagram", "steps": [{"label": "Read BAQ", "description": "Correct query shape and parameters."}, {"label": "UBAq Action", "description": "Controlled editable intent + safe update processing."}, {"label": "Consumer", "description": "App Studio or REST."}, {"label": "Tests", "description": "Success, no-data, invalid input, and update failure."}, {"label": "Review", "description": "Security, performance, naming, and documentation."}]}]	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	{}	{}	{}	read
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."topics" ("id", "course_id", "title", "slug", "sequence_order", "created_at", "updated_at", "difficulty", "est_minutes", "description", "learning_objectives", "skills", "prerequisite_topic_id") FROM stdin;
04b6fa70-54c0-466a-ac9e-38d8b93aaeb0	6b0e4eb1-baad-4306-9377-2966d272e1ad	Kinetic Basics: Login & Navigation	epicor-basics	0	2026-08-12 08:58:28.680761+00	2026-08-12 09:59:52.886662+00	\N	\N	\N	{}	{}	\N
125375c3-ad6d-45c2-b736-e7a3d795b264	6b0e4eb1-baad-4306-9377-2966d272e1ad	Application Studio Fundamentals	app-studio-fundamentals	1	2026-08-12 07:16:50.927147+00	2026-08-12 09:59:53.66344+00	\N	\N	\N	{}	{}	\N
fcf88bda-2531-4bf2-b0a6-8b755c4decd2	6b0e4eb1-baad-4306-9377-2966d272e1ad	Application Map & Page Architecture	application-map-and-pages	2	2026-08-12 07:16:51.203086+00	2026-08-12 09:59:53.926262+00	\N	\N	\N	{}	{}	\N
6ee03325-3f28-452e-bb59-34d2a76a2c97	6b0e4eb1-baad-4306-9377-2966d272e1ad	Components, Layout & Reusable Building Blocks	components-and-layout	3	2026-08-12 07:16:51.476604+00	2026-08-12 09:59:54.69751+00	\N	\N	\N	{}	{}	\N
0b1740e2-f7fc-4be4-907a-a343f792ec17	6b0e4eb1-baad-4306-9377-2966d272e1ad	Data Rules & Events	data-rules-and-events	4	2026-08-12 07:16:51.745395+00	2026-08-12 09:59:54.973256+00	\N	\N	\N	{}	{}	\N
50ea9ec9-f247-48cf-98ee-34a43cea2ede	6b0e4eb1-baad-4306-9377-2966d272e1ad	DataViews, Widgets & Sliding Panels in Practice	dataviews-widgets-panels	5	2026-08-12 07:16:52.495327+00	2026-08-12 09:59:55.240726+00	\N	\N	\N	{}	{}	\N
2c98fcce-ad1c-4454-acac-f57701b5a900	6b0e4eb1-baad-4306-9377-2966d272e1ad	Layers, Publishing, Governance & the SDK	layers-publishing-sdk	6	2026-08-12 07:16:53.23944+00	2026-08-12 09:59:55.529189+00	\N	\N	\N	{}	{}	\N
01de9403-0222-443b-b13f-0193ef42d38b	6b0e4eb1-baad-4306-9377-2966d272e1ad	Functions & Server-Side Logic	functions-server-logic	7	2026-08-12 07:16:53.508051+00	2026-08-12 09:59:55.792218+00	\N	\N	\N	{}	{}	\N
a020390c-a9d9-4e19-918a-57bd552dcad6	6b0e4eb1-baad-4306-9377-2966d272e1ad	Component Reference Library	component-reference-library	8	2026-08-12 07:16:53.780434+00	2026-08-12 09:59:56.525253+00	\N	\N	\N	{}	{}	\N
8687a364-3365-4263-a994-8d3a2f1279d4	48179869-6ae4-40c6-b676-c5ec7d43b054	BAQ Foundations and Your First Query	baq-foundations-first-query	1	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
a70befb4-e471-4faa-a8e2-7248f5c47acb	48179869-6ae4-40c6-b676-c5ec7d43b054	Tables, Relationships, and Joins	baq-tables-relationships-joins	2	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
60dc6b61-7384-4789-9004-ede022fa9f44	48179869-6ae4-40c6-b676-c5ec7d43b054	Filters, Criteria, and Parameters	baq-filters-criteria-parameters	3	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
a53f8dd7-b87b-4dab-8dbd-4fe252e3f9a1	48179869-6ae4-40c6-b676-c5ec7d43b054	Display Fields, Calculations, and Aggregation	baq-display-calculations-aggregation	4	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
83014076-c3bb-49b5-a31e-388e14614ad7	48179869-6ae4-40c6-b676-c5ec7d43b054	Subqueries and Advanced BAQ Design	baq-subqueries-advanced-design	5	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
764e0095-d566-4915-b785-8e2051709d97	48179869-6ae4-40c6-b676-c5ec7d43b054	Testing, Security, and Performance	baq-testing-security-performance	6	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
5162aad4-ba6c-4d9f-8371-95651c0f4388	48179869-6ae4-40c6-b676-c5ec7d43b054	BAQ DataViews, Grids, and Runtime Filtering	baq-dataviews-grids-runtime-filtering	7	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
2db3a3e6-3353-4930-bc26-90c28f2890ef	48179869-6ae4-40c6-b676-c5ec7d43b054	BAQ-Powered Combos and App Studio Events	baq-combos-app-studio-events	8	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
0806b353-5ad0-4fd8-b2be-58166fdced4a	48179869-6ae4-40c6-b676-c5ec7d43b054	Updatable BAQ Fundamentals	updatable-baq-fundamentals	9	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
ad8796d8-2e79-4e61-9ec2-a08859f3f263	48179869-6ae4-40c6-b676-c5ec7d43b054	Advanced UBAQ BPM Processing	advanced-ubaq-bpm-processing	10	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
8d8c67b9-1f1a-471b-ba12-c969e0f8540f	48179869-6ae4-40c6-b676-c5ec7d43b054	BAQ Reports	baq-reports	11	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
e3e09f86-4c23-4652-b90f-4bb72214a27a	48179869-6ae4-40c6-b676-c5ec7d43b054	BAQs through REST and Integration	baq-rest-integration	12	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
7bdf94f5-9009-420c-ac5f-10975d1bea60	48179869-6ae4-40c6-b676-c5ec7d43b054	Hands-On BAQ Practice and Capstone	baq-hands-on-capstone	13	2026-08-12 14:10:34.828407+00	2026-08-12 14:10:34.828407+00	\N	\N	\N	{}	{}	\N
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2026-08-11 08:20:39
20211116045059	2026-08-11 08:20:39
20211116050929	2026-08-11 08:20:39
20211116051442	2026-08-11 08:20:39
20211116212300	2026-08-11 08:20:39
20211116213355	2026-08-11 08:20:39
20211116213934	2026-08-11 08:20:39
20211116214523	2026-08-11 08:20:39
20211122062447	2026-08-11 08:20:39
20211124070109	2026-08-11 08:20:39
20211202204204	2026-08-11 08:20:39
20211202204605	2026-08-11 08:20:39
20211210212804	2026-08-11 08:20:39
20211228014915	2026-08-11 08:20:39
20220107221237	2026-08-11 08:20:39
20220228202821	2026-08-11 08:20:39
20220312004840	2026-08-11 08:20:39
20220603231003	2026-08-11 08:20:39
20220603232444	2026-08-11 08:20:39
20220615214548	2026-08-11 08:20:39
20220712093339	2026-08-11 08:20:39
20220908172859	2026-08-11 08:20:39
20220916233421	2026-08-11 08:20:39
20230119133233	2026-08-11 08:20:39
20230128025114	2026-08-11 08:20:39
20230128025212	2026-08-11 08:20:39
20230227211149	2026-08-11 08:20:39
20230228184745	2026-08-11 08:20:39
20230308225145	2026-08-11 08:20:39
20230328144023	2026-08-11 08:20:39
20231018144023	2026-08-11 08:20:39
20231204144023	2026-08-11 08:20:39
20231204144024	2026-08-11 08:20:39
20231204144025	2026-08-11 08:20:39
20240108234812	2026-08-11 08:20:39
20240109165339	2026-08-11 08:20:39
20240227174441	2026-08-11 08:20:39
20240311171622	2026-08-11 08:20:39
20240321100241	2026-08-11 08:20:39
20240401105812	2026-08-11 08:20:39
20240418121054	2026-08-11 08:20:39
20240523004032	2026-08-11 08:20:39
20240618124746	2026-08-11 08:20:39
20240801235015	2026-08-11 08:20:39
20240805133720	2026-08-11 08:20:39
20240827160934	2026-08-11 08:20:39
20240919163303	2026-08-11 08:20:39
20240919163305	2026-08-11 08:20:39
20241019105805	2026-08-11 08:20:39
20241030150047	2026-08-11 08:20:39
20241108114728	2026-08-11 08:20:39
20241121104152	2026-08-11 08:20:39
20241130184212	2026-08-11 08:20:39
20241220035512	2026-08-11 08:20:39
20241220123912	2026-08-11 08:20:39
20241224161212	2026-08-11 08:20:39
20250107150512	2026-08-11 08:20:39
20250110162412	2026-08-11 08:20:39
20250123174212	2026-08-11 08:20:39
20250128220012	2026-08-11 08:20:39
20250506224012	2026-08-11 08:20:39
20250523164012	2026-08-11 08:20:39
20250714121412	2026-08-11 08:20:39
20250905041441	2026-08-11 08:20:39
20251103001201	2026-08-11 08:20:39
20251120212548	2026-08-11 08:20:39
20251120215549	2026-08-11 08:20:39
20260218120000	2026-08-11 08:20:39
20260326120000	2026-08-11 08:20:39
20260514120000	2026-08-11 08:20:39
20260527120000	2026-08-11 08:20:39
20260528120000	2026-08-11 08:20:39
20260603120000	2026-08-11 08:20:39
20260605120000	2026-08-11 08:20:39
20260606110000	2026-08-11 08:20:39
20260616120000	2026-08-11 08:20:39
20260624120000	2026-08-11 08:20:39
20260626120000	2026-08-11 08:20:39
20260706120000	2026-08-11 08:20:39
20260707120000	2026-08-11 08:20:39
20260709120000	2026-08-11 08:20:39
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at", "action_filter", "selected_columns") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
KineticUI	KineticUI	\N	2026-08-11 12:01:23.555317+00	2026-08-11 12:01:23.555317+00	t	f	\N	\N	\N	STANDARD
course-assets	course-assets	\N	2026-08-12 06:21:27.132352+00	2026-08-12 06:21:27.132352+00	t	f	10485760	{image/png,image/jpeg,image/jpg,image/webp,image/gif}	\N	STANDARD
course-videos	course-videos	\N	2026-08-13 05:06:09.902505+00	2026-08-13 05:06:09.902505+00	t	f	524288000	{video/mp4,video/webm,video/quicktime,video/x-matroska,video/ogg}	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-08-11 07:07:01.290438
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-08-11 07:07:01.331991
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-08-11 07:07:01.335615
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-08-11 07:07:01.36062
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-08-11 07:07:01.376798
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-08-11 07:07:01.38044
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-08-11 07:07:01.384396
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-08-11 07:07:01.389759
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-08-11 07:07:01.394065
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-08-11 07:07:01.397971
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-08-11 07:07:01.403644
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-08-11 07:07:01.40886
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-08-11 07:07:01.412687
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-08-11 07:07:01.417074
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-08-11 07:07:01.420716
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-08-11 07:07:01.44631
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-08-11 07:07:01.449824
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-08-11 07:07:01.45359
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-08-11 07:07:01.457202
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-08-11 07:07:01.462481
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-08-11 07:07:01.468022
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-08-11 07:07:01.4735
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-08-11 07:07:01.486867
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-08-11 07:07:01.495543
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-08-11 07:07:01.499175
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-08-11 07:07:01.503197
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-08-11 07:07:01.507735
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-08-11 07:07:01.511482
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-08-11 07:07:01.516607
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-08-11 07:07:01.519904
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-08-11 07:07:01.522992
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-08-11 07:07:01.5274
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-08-11 07:07:01.530551
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-08-11 07:07:01.533588
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-08-11 07:07:01.536891
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-08-11 07:07:01.539938
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-08-11 07:07:01.543369
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-08-11 07:07:01.54673
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-08-11 07:07:01.55101
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-08-11 07:07:01.563031
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-08-11 07:07:01.567414
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-08-11 07:07:01.571698
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-08-11 07:07:01.574666
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-08-11 07:07:01.577539
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-08-11 07:07:01.580564
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-08-11 07:07:01.584575
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-08-11 07:07:01.597023
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-08-11 07:07:01.602311
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-08-11 07:07:01.606386
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-08-11 07:07:01.624837
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-08-11 07:07:01.633178
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-08-11 07:07:02.619187
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-08-11 07:07:02.62101
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-08-11 07:07:02.62854
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-08-11 07:07:02.630591
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-08-11 07:07:02.632222
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-08-11 07:07:02.635771
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-08-11 07:07:02.640195
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-08-11 07:07:02.643478
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-08-11 07:07:02.648257
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-08-11 07:07:02.651518
61	mark-filename-immutable	fe0096517ae9d60aaec1d110172ba9036dc66bb7	2026-08-11 10:27:54.144143
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
81432444-4cef-4105-861d-24d9df27bceb	KineticUI	LoginScreen.png	\N	2026-08-11 13:55:08.706233+00	2026-08-11 13:55:08.706233+00	2026-08-11 13:55:08.706233+00	{"eTag": "\\"683f97f14319f9a841da6618e343251d-1\\"", "size": 667639, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T13:55:08.000Z", "contentLength": 667639, "httpStatusCode": 200}	08f3ee4f-3388-43f1-b812-fc4508918c5f	\N	\N
9cec6054-dd4e-42af-8d98-8c3fb40b6f65	KineticUI	HomePage.png	\N	2026-08-11 13:59:32.402741+00	2026-08-11 13:59:32.402741+00	2026-08-11 13:59:32.402741+00	{"eTag": "\\"d2f5c9b8bdd0726421d89e2dea9785be-1\\"", "size": 41363, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T13:59:32.000Z", "contentLength": 41363, "httpStatusCode": 200}	a12a098e-b12d-4a97-a7dc-4e7af9d1b7ea	\N	\N
0697e074-d7b4-4898-be2c-79bfaaba3d1b	KineticUI	MainMenu.png	\N	2026-08-11 13:59:33.37873+00	2026-08-11 13:59:33.37873+00	2026-08-11 13:59:33.37873+00	{"eTag": "\\"a1af14daba2ad2e7494b025a31fdef71-1\\"", "size": 65530, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T13:59:33.000Z", "contentLength": 65530, "httpStatusCode": 200}	f795339a-cb79-4b02-a782-d6a296de601e	\N	\N
8f347a9d-948e-40de-a306-5333fdd1ca03	course-assets	courses/b799fa48-0d97-4ab3-b1ef-8191b971fca4.png	bd83ba32-0763-4fa4-a363-9ace943a363a	2026-08-12 07:48:33.804441+00	2026-08-12 07:48:33.804441+00	2026-08-12 07:48:33.804441+00	{"eTag": "\\"9b33c38fa91efb8fab2fbe011c96beb2\\"", "size": 18614, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-12T07:48:34.000Z", "contentLength": 18614, "httpStatusCode": 200}	b4fa1d28-e65e-4379-b52f-bda35afdd50e	bd83ba32-0763-4fa4-a363-9ace943a363a	{}
ee289714-cdff-4f60-87f3-df77107b1a07	course-assets	courses/899fdf28-19b0-4388-9fbf-7c47b140651a.png	bd83ba32-0763-4fa4-a363-9ace943a363a	2026-08-12 11:48:48.36134+00	2026-08-12 11:48:48.36134+00	2026-08-12 11:48:48.36134+00	{"eTag": "\\"9b33c38fa91efb8fab2fbe011c96beb2\\"", "size": 18614, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-12T11:48:49.000Z", "contentLength": 18614, "httpStatusCode": 200}	70aaa9b0-e67a-407d-a3b3-0958290f335c	bd83ba32-0763-4fa4-a363-9ace943a363a	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY "supabase_migrations"."schema_migrations" ("version", "statements", "name", "created_by", "idempotency_key", "rollback") FROM stdin;
20260811082637	{"-- Employees taking the training\ncreate table if not exists public.employees (\n  id uuid primary key default gen_random_uuid(),\n  email text unique not null,\n  full_name text,\n  created_at timestamptz not null default now(),\n  last_seen_at timestamptz not null default now()\n);\n\n-- Which lessons each employee has completed\ncreate table if not exists public.lesson_progress (\n  id uuid primary key default gen_random_uuid(),\n  employee_id uuid not null references public.employees(id) on delete cascade,\n  module_slug text not null,\n  lesson_id text not null,\n  completed_at timestamptz not null default now(),\n  unique (employee_id, module_slug, lesson_id)\n);\n\n-- Quiz attempts and scores per module\ncreate table if not exists public.quiz_attempts (\n  id uuid primary key default gen_random_uuid(),\n  employee_id uuid not null references public.employees(id) on delete cascade,\n  module_slug text not null,\n  score_pct int not null check (score_pct >= 0 and score_pct <= 100),\n  passed boolean not null default false,\n  attempted_at timestamptz not null default now()\n);\n\n-- Handy view: best score + certification status per employee/module\ncreate or replace view public.module_certifications as\nselect\n  employee_id,\n  module_slug,\n  max(score_pct) as best_score_pct,\n  bool_or(passed) as certified,\n  min(attempted_at) filter (where passed) as certified_at\nfrom public.quiz_attempts\ngroup by employee_id, module_slug;\n\nalter table public.employees enable row level security;\nalter table public.lesson_progress enable row level security;\nalter table public.quiz_attempts enable row level security;\n\n-- MVP policies: anon (publishable) key can read/write, scoped by employee_id\n-- the client already knows (no Supabase Auth wired up yet). Tighten this\n-- once real authentication is added.\ncreate policy \\"anon can select employees\\" on public.employees\n  for select using (true);\ncreate policy \\"anon can upsert employees\\" on public.employees\n  for insert with check (true);\ncreate policy \\"anon can update own employee row\\" on public.employees\n  for update using (true);\n\ncreate policy \\"anon can select lesson_progress\\" on public.lesson_progress\n  for select using (true);\ncreate policy \\"anon can insert lesson_progress\\" on public.lesson_progress\n  for insert with check (true);\n\ncreate policy \\"anon can select quiz_attempts\\" on public.quiz_attempts\n  for select using (true);\ncreate policy \\"anon can insert quiz_attempts\\" on public.quiz_attempts\n  for insert with check (true);\n\ncreate index if not exists idx_lesson_progress_employee on public.lesson_progress(employee_id);\ncreate index if not exists idx_quiz_attempts_employee on public.quiz_attempts(employee_id);\n"}	create_training_schema	hatim@quitebinary.com	\N	\N
20260811082724	{"alter view public.module_certifications set (security_invoker = true);"}	fix_view_security_invoker	hatim@quitebinary.com	\N	\N
20260811090516	{"-- Link employees 1:1 to Supabase Auth users\nalter table public.employees\n  drop constraint if exists employees_id_fkey;\n\n-- Recreate employees.id as a reference to auth.users so auth.uid() = employees.id\n-- (safe since table is currently empty)\ntruncate table public.quiz_attempts, public.lesson_progress, public.employees cascade;\n\nalter table public.employees\n  add constraint employees_id_fkey foreign key (id) references auth.users(id) on delete cascade;\n\n-- Auto-create an employee profile row whenever someone signs up via Supabase Auth\ncreate or replace function public.handle_new_user()\nreturns trigger\nlanguage plpgsql\nsecurity definer set search_path = public\nas $$\nbegin\n  insert into public.employees (id, email, full_name)\n  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))\n  on conflict (id) do nothing;\n  return new;\nend;\n$$;\n\ndrop trigger if exists on_auth_user_created on auth.users;\ncreate trigger on_auth_user_created\n  after insert on auth.users\n  for each row execute function public.handle_new_user();\n\n-- Module enrollments: which modules an employee has explicitly enrolled in\ncreate table if not exists public.enrollments (\n  id uuid primary key default gen_random_uuid(),\n  employee_id uuid not null references public.employees(id) on delete cascade,\n  module_slug text not null,\n  enrolled_at timestamptz not null default now(),\n  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'dropped')),\n  unique (employee_id, module_slug)\n);\nalter table public.enrollments enable row level security;\n\n-- Tighten RLS: employees can only see/manage their own data now that auth.uid() exists\ndrop policy if exists \\"anon can select employees\\" on public.employees;\ndrop policy if exists \\"anon can upsert employees\\" on public.employees;\ndrop policy if exists \\"anon can update own employee row\\" on public.employees;\ncreate policy \\"employees can view own profile\\" on public.employees\n  for select using (auth.uid() = id);\ncreate policy \\"employees can update own profile\\" on public.employees\n  for update using (auth.uid() = id);\n\ndrop policy if exists \\"anon can select lesson_progress\\" on public.lesson_progress;\ndrop policy if exists \\"anon can insert lesson_progress\\" on public.lesson_progress;\ncreate policy \\"employees manage own lesson_progress\\" on public.lesson_progress\n  for all using (auth.uid() = employee_id) with check (auth.uid() = employee_id);\n\ndrop policy if exists \\"anon can select quiz_attempts\\" on public.quiz_attempts;\ndrop policy if exists \\"anon can insert quiz_attempts\\" on public.quiz_attempts;\ncreate policy \\"employees manage own quiz_attempts\\" on public.quiz_attempts\n  for all using (auth.uid() = employee_id) with check (auth.uid() = employee_id);\n\ncreate policy \\"employees manage own enrollments\\" on public.enrollments\n  for all using (auth.uid() = employee_id) with check (auth.uid() = employee_id);\n\ncreate index if not exists idx_enrollments_employee on public.enrollments(employee_id);\n"}	add_auth_and_enrollments	hatim@quitebinary.com	\N	\N
20260811090537	{"revoke execute on function public.handle_new_user() from anon, authenticated;"}	revoke_public_exec_handle_new_user	hatim@quitebinary.com	\N	\N
20260811104807	{"revoke execute on function public.handle_new_user() from public, anon, authenticated;"}	revoke_public_exec_handle_new_user_v2	hatim@quitebinary.com	\N	\N
20260812062050	{"ALTER TABLE public.employees\n  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';\n\nDO $$\nBEGIN\n  IF NOT EXISTS (\n    SELECT 1 FROM pg_constraint WHERE conname = 'employees_role_check'\n  ) THEN\n    ALTER TABLE public.employees\n      ADD CONSTRAINT employees_role_check CHECK (role IN ('student', 'admin'));\n  END IF;\nEND $$;\n\nCREATE OR REPLACE FUNCTION public.is_admin(uid uuid)\nRETURNS boolean\nLANGUAGE sql\nSTABLE\nSECURITY DEFINER\nSET search_path = public\nAS $$\n  SELECT EXISTS (\n    SELECT 1 FROM public.employees WHERE id = uid AND role = 'admin'\n  );\n$$;\n\nGRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;"}	add_admin_role_to_employees	hatim@quitebinary.com	\N	\N
20260812062115	{"CREATE TABLE IF NOT EXISTS public.courses (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL CHECK (char_length(trim(title)) > 0),\n  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),\n  description text,\n  image_url text,\n  sequence_order integer NOT NULL DEFAULT 0,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now()\n);\n\nCREATE TABLE IF NOT EXISTS public.topics (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,\n  title text NOT NULL CHECK (char_length(trim(title)) > 0),\n  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),\n  sequence_order integer NOT NULL DEFAULT 0,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now(),\n  UNIQUE (course_id, slug)\n);\n\nCREATE TABLE IF NOT EXISTS public.subtopics (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,\n  title text NOT NULL CHECK (char_length(trim(title)) > 0),\n  sequence_order integer NOT NULL DEFAULT 0,\n  content_json jsonb NOT NULL DEFAULT '[]'::jsonb,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now()\n);\n\nCREATE TABLE IF NOT EXISTS public.quizzes (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  subtopic_id uuid NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,\n  questions_json jsonb NOT NULL DEFAULT '[]'::jsonb,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now(),\n  UNIQUE (subtopic_id)\n);\n\nCREATE INDEX IF NOT EXISTS idx_topics_course_id ON public.topics(course_id);\nCREATE INDEX IF NOT EXISTS idx_subtopics_topic_id ON public.subtopics(topic_id);\nCREATE INDEX IF NOT EXISTS idx_quizzes_subtopic_id ON public.quizzes(subtopic_id);\nCREATE INDEX IF NOT EXISTS idx_courses_sequence ON public.courses(sequence_order);\nCREATE INDEX IF NOT EXISTS idx_topics_sequence ON public.topics(course_id, sequence_order);\nCREATE INDEX IF NOT EXISTS idx_subtopics_sequence ON public.subtopics(topic_id, sequence_order);\n\nCREATE OR REPLACE FUNCTION public.set_updated_at()\nRETURNS trigger\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$;\n\nDROP TRIGGER IF EXISTS trg_courses_updated_at ON public.courses;\nCREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses\n  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();\n\nDROP TRIGGER IF EXISTS trg_topics_updated_at ON public.topics;\nCREATE TRIGGER trg_topics_updated_at BEFORE UPDATE ON public.topics\n  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();\n\nDROP TRIGGER IF EXISTS trg_subtopics_updated_at ON public.subtopics;\nCREATE TRIGGER trg_subtopics_updated_at BEFORE UPDATE ON public.subtopics\n  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();\n\nDROP TRIGGER IF EXISTS trg_quizzes_updated_at ON public.quizzes;\nCREATE TRIGGER trg_quizzes_updated_at BEFORE UPDATE ON public.quizzes\n  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();\n\nALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \\"public read courses\\" ON public.courses FOR SELECT USING (true);\nCREATE POLICY \\"public read topics\\" ON public.topics FOR SELECT USING (true);\nCREATE POLICY \\"public read subtopics\\" ON public.subtopics FOR SELECT USING (true);\nCREATE POLICY \\"public read quizzes\\" ON public.quizzes FOR SELECT USING (true);\n\nCREATE POLICY \\"admins write courses\\" ON public.courses FOR INSERT WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins update courses\\" ON public.courses FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins delete courses\\" ON public.courses FOR DELETE USING (public.is_admin(auth.uid()));\n\nCREATE POLICY \\"admins write topics\\" ON public.topics FOR INSERT WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins update topics\\" ON public.topics FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins delete topics\\" ON public.topics FOR DELETE USING (public.is_admin(auth.uid()));\n\nCREATE POLICY \\"admins write subtopics\\" ON public.subtopics FOR INSERT WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins update subtopics\\" ON public.subtopics FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins delete subtopics\\" ON public.subtopics FOR DELETE USING (public.is_admin(auth.uid()));\n\nCREATE POLICY \\"admins write quizzes\\" ON public.quizzes FOR INSERT WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins update quizzes\\" ON public.quizzes FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));\nCREATE POLICY \\"admins delete quizzes\\" ON public.quizzes FOR DELETE USING (public.is_admin(auth.uid()));"}	create_cms_tables	hatim@quitebinary.com	\N	\N
20260812062127	{"INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)\nVALUES ('course-assets', 'course-assets', true, 10485760, ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif'])\nON CONFLICT (id) DO UPDATE SET\n  public = EXCLUDED.public,\n  file_size_limit = EXCLUDED.file_size_limit,\n  allowed_mime_types = EXCLUDED.allowed_mime_types;\n\nCREATE POLICY \\"public read course-assets\\" ON storage.objects\n  FOR SELECT USING (bucket_id = 'course-assets');\n\nCREATE POLICY \\"admins upload course-assets\\" ON storage.objects\n  FOR INSERT WITH CHECK (\n    bucket_id = 'course-assets' AND public.is_admin(auth.uid())\n  );\n\nCREATE POLICY \\"admins update course-assets\\" ON storage.objects\n  FOR UPDATE USING (\n    bucket_id = 'course-assets' AND public.is_admin(auth.uid())\n  ) WITH CHECK (\n    bucket_id = 'course-assets' AND public.is_admin(auth.uid())\n  );\n\nCREATE POLICY \\"admins delete course-assets\\" ON storage.objects\n  FOR DELETE USING (\n    bucket_id = 'course-assets' AND public.is_admin(auth.uid())\n  );"}	create_course_assets_bucket	hatim@quitebinary.com	\N	\N
20260812062245	{"CREATE OR REPLACE FUNCTION public.admin_bulk_import_course(payload jsonb)\nRETURNS uuid\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nDECLARE\n  v_course_id uuid;\n  v_topic_id uuid;\n  v_subtopic_id uuid;\n  v_topic jsonb;\n  v_subtopic jsonb;\nBEGIN\n  IF NOT public.is_admin(auth.uid()) THEN\n    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';\n  END IF;\n\n  IF payload->'course' IS NULL THEN\n    RAISE EXCEPTION 'payload.course is required';\n  END IF;\n\n  INSERT INTO public.courses (title, slug, description, image_url, sequence_order)\n  VALUES (\n    payload->'course'->>'title',\n    payload->'course'->>'slug',\n    payload->'course'->>'description',\n    payload->'course'->>'image_url',\n    COALESCE((payload->'course'->>'sequence_order')::integer, 0)\n  )\n  RETURNING id INTO v_course_id;\n\n  FOR v_topic IN SELECT * FROM jsonb_array_elements(COALESCE(payload->'topics', '[]'::jsonb))\n  LOOP\n    INSERT INTO public.topics (course_id, title, slug, sequence_order)\n    VALUES (\n      v_course_id,\n      v_topic->>'title',\n      v_topic->>'slug',\n      COALESCE((v_topic->>'sequence_order')::integer, 0)\n    )\n    RETURNING id INTO v_topic_id;\n\n    FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))\n    LOOP\n      INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)\n      VALUES (\n        v_topic_id,\n        v_subtopic->>'title',\n        COALESCE((v_subtopic->>'sequence_order')::integer, 0),\n        COALESCE(v_subtopic->'content_json', '[]'::jsonb)\n      )\n      RETURNING id INTO v_subtopic_id;\n\n      IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN\n        INSERT INTO public.quizzes (subtopic_id, questions_json)\n        VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');\n      END IF;\n    END LOOP;\n  END LOOP;\n\n  RETURN v_course_id;\nEND;\n$$;\n\nGRANT EXECUTE ON FUNCTION public.admin_bulk_import_course(jsonb) TO authenticated;"}	create_bulk_import_rpc	hatim@quitebinary.com	\N	\N
20260812073843	{"CREATE OR REPLACE FUNCTION public.admin_bulk_import_courses(payload jsonb)\nRETURNS jsonb\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nDECLARE\n  v_courses jsonb := coalesce(payload->'courses', '[]'::jsonb);\n  v_course_item jsonb;\n  v_imported jsonb := '[]'::jsonb;\n  v_errors jsonb := '[]'::jsonb;\n  v_course_id uuid;\n  v_topic_id uuid;\n  v_subtopic_id uuid;\n  v_topic jsonb;\n  v_subtopic jsonb;\n  v_title text;\nBEGIN\n  IF NOT public.is_admin(auth.uid()) THEN\n    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';\n  END IF;\n\n  IF jsonb_typeof(v_courses) <> 'array' OR jsonb_array_length(v_courses) = 0 THEN\n    RAISE EXCEPTION 'payload.courses must be a non-empty array';\n  END IF;\n\n  FOR v_course_item IN SELECT * FROM jsonb_array_elements(v_courses)\n  LOOP\n    v_title := v_course_item->'course'->>'title';\n    -- Each iteration's BEGIN/EXCEPTION block is an implicit savepoint in\n    -- plpgsql: if THIS course fails partway through (any insert errors\n    -- out), only its own inserts are rolled back and we move on to the\n    -- next course, instead of one bad course aborting the entire batch.\n    BEGIN\n      INSERT INTO public.courses (title, slug, description, image_url, sequence_order)\n      VALUES (\n        v_course_item->'course'->>'title',\n        v_course_item->'course'->>'slug',\n        v_course_item->'course'->>'description',\n        v_course_item->'course'->>'image_url',\n        COALESCE((v_course_item->'course'->>'sequence_order')::integer, 0)\n      )\n      RETURNING id INTO v_course_id;\n\n      FOR v_topic IN SELECT * FROM jsonb_array_elements(COALESCE(v_course_item->'topics', '[]'::jsonb))\n      LOOP\n        INSERT INTO public.topics (course_id, title, slug, sequence_order)\n        VALUES (\n          v_course_id,\n          v_topic->>'title',\n          v_topic->>'slug',\n          COALESCE((v_topic->>'sequence_order')::integer, 0)\n        )\n        RETURNING id INTO v_topic_id;\n\n        FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))\n        LOOP\n          INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)\n          VALUES (\n            v_topic_id,\n            v_subtopic->>'title',\n            COALESCE((v_subtopic->>'sequence_order')::integer, 0),\n            COALESCE(v_subtopic->'content_json', '[]'::jsonb)\n          )\n          RETURNING id INTO v_subtopic_id;\n\n          IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN\n            INSERT INTO public.quizzes (subtopic_id, questions_json)\n            VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');\n          END IF;\n        END LOOP;\n      END LOOP;\n\n      v_imported := v_imported || jsonb_build_object('title', v_title, 'id', v_course_id);\n    EXCEPTION WHEN OTHERS THEN\n      v_errors := v_errors || jsonb_build_object('title', v_title, 'error', SQLERRM);\n    END;\n  END LOOP;\n\n  RETURN jsonb_build_object('imported', v_imported, 'errors', v_errors);\nEND;\n$$;\n\nGRANT EXECUTE ON FUNCTION public.admin_bulk_import_courses(jsonb) TO authenticated;"}	create_multi_course_bulk_import_rpc	hatim@quitebinary.com	\N	\N
20260812081024	{"DO $$\nDECLARE\n  v_parent_id uuid;\nBEGIN\n  INSERT INTO public.courses (title, slug, description, sequence_order)\n  VALUES (\n    'Kinetic Application Studio',\n    'kinetic-application-studio',\n    'The complete Kinetic Application Studio curriculum, covering everything from fundamentals to advanced SDK development.',\n    0\n  )\n  RETURNING id INTO v_parent_id;\n\n  -- Re-parent every existing topic to the new umbrella course, preserving\n  -- their relative order via the old course's sequence_order.\n  UPDATE public.topics t\n  SET course_id = v_parent_id,\n      sequence_order = c.sequence_order\n  FROM public.courses c\n  WHERE t.course_id = c.id\n    AND c.id <> v_parent_id;\n\n  -- The 8 old top-level \\"courses\\" (now empty of topics) are no longer\n  -- needed as separate courses -- delete them. Their topics/subtopics/\n  -- quizzes were already moved above (FK is topics.course_id, not\n  -- cascaded from these rows), so nothing else is lost.\n  DELETE FROM public.courses WHERE id <> v_parent_id;\nEND $$;"}	restructure_under_kinetic_application_studio	hatim@quitebinary.com	\N	\N
20260812082521	{"CREATE OR REPLACE FUNCTION public.admin_bulk_import_courses(payload jsonb)\nRETURNS jsonb\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nDECLARE\n  v_courses jsonb := coalesce(payload->'courses', '[]'::jsonb);\n  v_course_item jsonb;\n  v_imported jsonb := '[]'::jsonb;\n  v_errors jsonb := '[]'::jsonb;\n  v_course_id uuid;\n  v_topic_id uuid;\n  v_subtopic_id uuid;\n  v_topic jsonb;\n  v_subtopic jsonb;\n  v_title text;\n  v_existing_slug text;\n  v_next_topic_order integer;\nBEGIN\n  IF NOT public.is_admin(auth.uid()) THEN\n    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';\n  END IF;\n\n  IF jsonb_typeof(v_courses) <> 'array' OR jsonb_array_length(v_courses) = 0 THEN\n    RAISE EXCEPTION 'payload.courses must be a non-empty array';\n  END IF;\n\n  FOR v_course_item IN SELECT * FROM jsonb_array_elements(v_courses)\n  LOOP\n    v_existing_slug := v_course_item->>'existing_course_slug';\n    v_title := COALESCE(v_course_item->'course'->>'title', v_existing_slug);\n\n    BEGIN\n      IF v_existing_slug IS NOT NULL THEN\n        SELECT id INTO v_course_id FROM public.courses WHERE slug = v_existing_slug;\n        IF v_course_id IS NULL THEN\n          RAISE EXCEPTION 'No existing course found with slug \\"%\\"', v_existing_slug;\n        END IF;\n        SELECT COALESCE(MAX(sequence_order), -1) + 1 INTO v_next_topic_order\n          FROM public.topics WHERE course_id = v_course_id;\n      ELSE\n        INSERT INTO public.courses (title, slug, description, image_url, sequence_order)\n        VALUES (\n          v_course_item->'course'->>'title',\n          v_course_item->'course'->>'slug',\n          v_course_item->'course'->>'description',\n          v_course_item->'course'->>'image_url',\n          COALESCE((v_course_item->'course'->>'sequence_order')::integer, 0)\n        )\n        RETURNING id INTO v_course_id;\n        v_next_topic_order := 0;\n      END IF;\n\n      FOR v_topic IN SELECT * FROM jsonb_array_elements(COALESCE(v_course_item->'topics', '[]'::jsonb))\n      LOOP\n        INSERT INTO public.topics (course_id, title, slug, sequence_order)\n        VALUES (\n          v_course_id,\n          v_topic->>'title',\n          v_topic->>'slug',\n          COALESCE((v_topic->>'sequence_order')::integer, v_next_topic_order)\n        )\n        RETURNING id INTO v_topic_id;\n        v_next_topic_order := v_next_topic_order + 1;\n\n        FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))\n        LOOP\n          INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)\n          VALUES (\n            v_topic_id,\n            v_subtopic->>'title',\n            COALESCE((v_subtopic->>'sequence_order')::integer, 0),\n            COALESCE(v_subtopic->'content_json', '[]'::jsonb)\n          )\n          RETURNING id INTO v_subtopic_id;\n\n          IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN\n            INSERT INTO public.quizzes (subtopic_id, questions_json)\n            VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');\n          END IF;\n        END LOOP;\n      END LOOP;\n\n      v_imported := v_imported || jsonb_build_object('title', v_title, 'id', v_course_id);\n    EXCEPTION WHEN OTHERS THEN\n      v_errors := v_errors || jsonb_build_object('title', v_title, 'error', SQLERRM);\n    END;\n  END LOOP;\n\n  RETURN jsonb_build_object('imported', v_imported, 'errors', v_errors);\nEND;\n$$;"}	support_append_mode_bulk_import	hatim@quitebinary.com	\N	\N
20260812084647	{"CREATE OR REPLACE FUNCTION public.admin_bulk_import_topics_into_course(p_course_slug text, payload jsonb)\nRETURNS jsonb\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nDECLARE\n  v_course_id uuid;\n  v_topics jsonb := coalesce(payload->'topics', '[]'::jsonb);\n  v_topic jsonb;\n  v_subtopic jsonb;\n  v_topic_id uuid;\n  v_subtopic_id uuid;\n  v_title text;\n  v_imported jsonb := '[]'::jsonb;\n  v_errors jsonb := '[]'::jsonb;\n  v_base_order integer;\nBEGIN\n  IF NOT public.is_admin(auth.uid()) THEN\n    RAISE EXCEPTION 'Only admins may run bulk imports' USING ERRCODE = '42501';\n  END IF;\n\n  SELECT id INTO v_course_id FROM public.courses WHERE slug = p_course_slug;\n  IF v_course_id IS NULL THEN\n    RAISE EXCEPTION 'No course found with slug \\"%\\"', p_course_slug;\n  END IF;\n\n  IF jsonb_typeof(v_topics) <> 'array' OR jsonb_array_length(v_topics) = 0 THEN\n    RAISE EXCEPTION 'payload.topics must be a non-empty array';\n  END IF;\n\n  SELECT coalesce(max(sequence_order), -1) INTO v_base_order FROM public.topics WHERE course_id = v_course_id;\n\n  FOR v_topic IN SELECT * FROM jsonb_array_elements(v_topics)\n  LOOP\n    v_title := v_topic->>'title';\n    v_base_order := v_base_order + 1;\n    BEGIN\n      INSERT INTO public.topics (course_id, title, slug, sequence_order)\n      VALUES (\n        v_course_id,\n        v_topic->>'title',\n        v_topic->>'slug',\n        v_base_order\n      )\n      RETURNING id INTO v_topic_id;\n\n      FOR v_subtopic IN SELECT * FROM jsonb_array_elements(COALESCE(v_topic->'subtopics', '[]'::jsonb))\n      LOOP\n        INSERT INTO public.subtopics (topic_id, title, sequence_order, content_json)\n        VALUES (\n          v_topic_id,\n          v_subtopic->>'title',\n          COALESCE((v_subtopic->>'sequence_order')::integer, 0),\n          COALESCE(v_subtopic->'content_json', '[]'::jsonb)\n        )\n        RETURNING id INTO v_subtopic_id;\n\n        IF v_subtopic->'quiz' IS NOT NULL AND jsonb_typeof(v_subtopic->'quiz'->'questions_json') = 'array' THEN\n          INSERT INTO public.quizzes (subtopic_id, questions_json)\n          VALUES (v_subtopic_id, v_subtopic->'quiz'->'questions_json');\n        END IF;\n      END LOOP;\n\n      v_imported := v_imported || jsonb_build_object('title', v_title, 'id', v_topic_id);\n    EXCEPTION WHEN OTHERS THEN\n      v_errors := v_errors || jsonb_build_object('title', v_title, 'error', SQLERRM);\n    END;\n  END LOOP;\n\n  RETURN jsonb_build_object('course_id', v_course_id, 'imported', v_imported, 'errors', v_errors);\nEND;\n$$;\n\nGRANT EXECUTE ON FUNCTION public.admin_bulk_import_topics_into_course(text, jsonb) TO authenticated;"}	create_import_topics_into_existing_course_rpc	hatim@quitebinary.com	\N	\N
20260812104215	{"ALTER TABLE public.courses\n  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;\n\n-- Public read policy already allows anyone to select all columns; no RLS\n-- change needed here. Filtering by is_published happens in the query\n-- layer (lib/cms/queries.ts), same as every other public course fetch."}	add_is_published_to_courses	hatim@quitebinary.com	\N	\N
20260812121409	{"ALTER TABLE public.topics\n  ADD COLUMN IF NOT EXISTS difficulty text,\n  ADD COLUMN IF NOT EXISTS est_minutes integer;\n\n-- Both nullable by design: the query layer (lib/cms/queries.ts) falls back\n-- gracefully when either is null (difficulty -> 'Standard', est_minutes ->\n-- computed from subtopic count) rather than requiring every topic to be\n-- backfilled before the rich card UI works."}	add_topic_difficulty_and_duration	hatim@quitebinary.com	\N	\N
20260812122344	{"ALTER TABLE public.subtopics\n  ADD COLUMN IF NOT EXISTS est_minutes integer;\n\n-- Nullable by design, same pattern as topics.est_minutes: the query/page\n-- layer falls back to a default (~5 min) per subtopic when unset, so the\n-- duration badge never disappears just because a subtopic hasn't been\n-- backfilled with real timing data."}	add_subtopic_est_minutes	hatim@quitebinary.com	\N	\N
20260812142647	{"CREATE OR REPLACE FUNCTION public.quiz_lockout_status(p_employee_id uuid, p_module_slug text)\nRETURNS jsonb\nLANGUAGE plpgsql\nSTABLE\nSECURITY DEFINER\nSET search_path TO 'public'\nAS $$\nDECLARE\n  v_fail_streak int := 0;\n  v_third_fail_at timestamptz := NULL;\n  v_row RECORD;\n  v_locked_until timestamptz;\nBEGIN\n  -- Walk attempts most-recent-first; count consecutive fails until a pass\n  -- breaks the streak. This reads existing quiz_attempts data only -- no\n  -- new write path needed, since recordQuizResult() already inserts a row\n  -- per attempt with employee_id/module_slug/passed/attempted_at.\n  FOR v_row IN\n    SELECT passed, attempted_at\n    FROM public.quiz_attempts\n    WHERE employee_id = p_employee_id AND module_slug = p_module_slug\n    ORDER BY attempted_at DESC\n  LOOP\n    IF v_row.passed THEN\n      EXIT;\n    END IF;\n    v_fail_streak := v_fail_streak + 1;\n    IF v_fail_streak = 3 THEN\n      v_third_fail_at := v_row.attempted_at;\n      EXIT;\n    END IF;\n  END LOOP;\n\n  IF v_third_fail_at IS NOT NULL THEN\n    v_locked_until := v_third_fail_at + interval '24 hours';\n  END IF;\n\n  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN\n    RETURN jsonb_build_object(\n      'locked', true,\n      'lockedUntil', v_locked_until,\n       'failStreak', v_fail_streak\n    );\n  END IF;\n\n  RETURN jsonb_build_object('locked', false, 'lockedUntil', null, 'failStreak', v_fail_streak);\nEND;\n$$;\n\n-- Callers may only ever check their own lockout status (SECURITY DEFINER\n-- bypasses RLS internally, so this guard is essential): enforce it in a\n-- thin wrapper that reads auth.uid() itself rather than trusting a\n-- caller-supplied employee_id.\nCREATE OR REPLACE FUNCTION public.my_quiz_lockout_status(p_module_slug text)\nRETURNS jsonb\nLANGUAGE sql\nSTABLE\nSECURITY DEFINER\nSET search_path TO 'public'\nAS $$\n  SELECT public.quiz_lockout_status(auth.uid(), p_module_slug);\n$$;\n\nGRANT EXECUTE ON FUNCTION public.my_quiz_lockout_status(text) TO authenticated;\nREVOKE EXECUTE ON FUNCTION public.quiz_lockout_status(uuid, text) FROM authenticated, anon;\n"}	add_quiz_lockout_function	hatim@quitebinary.com	\N	\N
20260812142808	{"CREATE OR REPLACE FUNCTION public.enforce_quiz_lockout()\nRETURNS trigger\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path TO 'public'\nAS $$\nDECLARE\n  v_status jsonb;\nBEGIN\n  v_status := public.quiz_lockout_status(NEW.employee_id, NEW.module_slug);\n  IF (v_status->>'locked')::boolean THEN\n    RAISE EXCEPTION 'Quiz locked for this module until %', v_status->>'lockedUntil'\n      USING ERRCODE = 'P0001';\n  END IF;\n  RETURN NEW;\nEND;\n$$;\n\nDROP TRIGGER IF EXISTS quiz_attempts_enforce_lockout ON public.quiz_attempts;\nCREATE TRIGGER quiz_attempts_enforce_lockout\n  BEFORE INSERT ON public.quiz_attempts\n  FOR EACH ROW\n  EXECUTE FUNCTION public.enforce_quiz_lockout();\n"}	enforce_quiz_lockout_trigger	hatim@quitebinary.com	\N	\N
20260812181248	{"-- Phase 1 of KINETIC_ACADEMY_PERPLEXITY_REFACTOR_BRIEF.md: extend the\n-- existing content model (brief §22/§32) and add the skill system (§17)\n-- and glossary (§19) as pure ADDITIVE, backward-compatible schema changes.\n-- Every new column is nullable/defaulted so existing rows and existing\n-- application code (which doesn't know about these columns yet) keep\n-- working exactly as before. No existing column, table, or row is touched.\n\nALTER TABLE public.topics\n  ADD COLUMN IF NOT EXISTS description text,\n  ADD COLUMN IF NOT EXISTS learning_objectives text[] NOT NULL DEFAULT '{}',\n  ADD COLUMN IF NOT EXISTS skills text[] NOT NULL DEFAULT '{}',\n  ADD COLUMN IF NOT EXISTS prerequisite_topic_id uuid REFERENCES public.topics(id) ON DELETE SET NULL;\n\nALTER TABLE public.subtopics\n  ADD COLUMN IF NOT EXISTS learning_objectives text[] NOT NULL DEFAULT '{}',\n  ADD COLUMN IF NOT EXISTS skills text[] NOT NULL DEFAULT '{}',\n  ADD COLUMN IF NOT EXISTS glossary_terms text[] NOT NULL DEFAULT '{}',\n  ADD COLUMN IF NOT EXISTS completion_rule text NOT NULL DEFAULT 'read'\n    CHECK (completion_rule IN ('read','interactive','practice','challenge','assessment'));\n\n-- Skill catalog (brief §17): tracked separately from course/topic completion.\nCREATE TABLE public.skills (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),\n  name text NOT NULL CHECK (char_length(trim(name)) > 0),\n  description text,\n  sequence_order int4 NOT NULL DEFAULT 0,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now()\n);\n\n-- Per-employee proficiency per skill (0-100), independent of any single\n-- course/topic/lesson -- multiple lessons across multiple courses can\n-- contribute to the same skill.\nCREATE TABLE public.employee_skill_progress (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  employee_id uuid NOT NULL REFERENCES public.employees(id),\n  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,\n  proficiency_pct int4 NOT NULL DEFAULT 0 CHECK (proficiency_pct >= 0 AND proficiency_pct <= 100),\n  updated_at timestamptz NOT NULL DEFAULT now(),\n  UNIQUE (employee_id, skill_id)\n);\n\n-- Searchable glossary (brief §19).\nCREATE TABLE public.glossary_terms (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  term text NOT NULL CHECK (char_length(trim(term)) > 0),\n  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),\n  definition text NOT NULL,\n  simple_explanation text,\n  used_in text,\n  related_topic_slugs text[] NOT NULL DEFAULT '{}',\n  created_at timestamptz NOT NULL DEFAULT now(),\n  updated_at timestamptz NOT NULL DEFAULT now()\n);\n\nALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.employee_skill_progress ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;\n\n-- Same public-read / admin-write pattern already used for courses/topics/subtopics/quizzes.\nCREATE POLICY \\"public read skills\\" ON public.skills FOR SELECT USING (true);\nCREATE POLICY \\"admins write skills\\" ON public.skills FOR INSERT WITH CHECK (is_admin(auth.uid()));\nCREATE POLICY \\"admins update skills\\" ON public.skills FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));\nCREATE POLICY \\"admins delete skills\\" ON public.skills FOR DELETE USING (is_admin(auth.uid()));\n\nCREATE POLICY \\"public read glossary_terms\\" ON public.glossary_terms FOR SELECT USING (true);\nCREATE POLICY \\"admins write glossary_terms\\" ON public.glossary_terms FOR INSERT WITH CHECK (is_admin(auth.uid()));\nCREATE POLICY \\"admins update glossary_terms\\" ON public.glossary_terms FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));\nCREATE POLICY \\"admins delete glossary_terms\\" ON public.glossary_terms FOR DELETE USING (is_admin(auth.uid()));\n\n-- Same self-row pattern already used for enrollments/lesson_progress/quiz_attempts.\nCREATE POLICY \\"employees manage own skill progress\\" ON public.employee_skill_progress FOR ALL\n  USING (auth.uid() = employee_id) WITH CHECK (auth.uid() = employee_id);\n"}	refactor_brief_phase1_content_model_and_skills	hatim@quitebinary.com	\N	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 27, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_realtime_admin
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."custom_oauth_providers"
    ADD CONSTRAINT "custom_oauth_providers_identifier_key" UNIQUE ("identifier");


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."custom_oauth_providers"
    ADD CONSTRAINT "custom_oauth_providers_pkey" PRIMARY KEY ("id");


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_client_states"
    ADD CONSTRAINT "oauth_client_states_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."webauthn_challenges"
    ADD CONSTRAINT "webauthn_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."webauthn_credentials"
    ADD CONSTRAINT "webauthn_credentials_pkey" PRIMARY KEY ("id");


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");


--
-- Name: employee_skill_progress employee_skill_progress_employee_id_skill_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employee_skill_progress"
    ADD CONSTRAINT "employee_skill_progress_employee_id_skill_id_key" UNIQUE ("employee_id", "skill_id");


--
-- Name: employee_skill_progress employee_skill_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employee_skill_progress"
    ADD CONSTRAINT "employee_skill_progress_pkey" PRIMARY KEY ("id");


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_email_key" UNIQUE ("email");


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");


--
-- Name: enrollments enrollments_employee_id_module_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_employee_id_module_slug_key" UNIQUE ("employee_id", "module_slug");


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");


--
-- Name: glossary_terms glossary_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."glossary_terms"
    ADD CONSTRAINT "glossary_terms_pkey" PRIMARY KEY ("id");


--
-- Name: glossary_terms glossary_terms_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."glossary_terms"
    ADD CONSTRAINT "glossary_terms_slug_key" UNIQUE ("slug");


--
-- Name: lesson_progress lesson_progress_employee_id_module_slug_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_employee_id_module_slug_lesson_id_key" UNIQUE ("employee_id", "module_slug", "lesson_id");


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id");


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_attempts"
    ADD CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id");


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id");


--
-- Name: quizzes quizzes_subtopic_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_subtopic_id_key" UNIQUE ("subtopic_id");


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");


--
-- Name: skills skills_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_slug_key" UNIQUE ("slug");


--
-- Name: subtopics subtopics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."subtopics"
    ADD CONSTRAINT "subtopics_pkey" PRIMARY KEY ("id");


--
-- Name: topics topics_course_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."topics"
    ADD CONSTRAINT "topics_course_id_slug_key" UNIQUE ("course_id", "slug");


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."topics"
    ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE "realtime"."messages"
    ADD CONSTRAINT "messages_payload_exclusive" CHECK ((("payload" IS NULL) OR ("binary_payload" IS NULL))) NOT VALID;


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_idempotency_key_key" UNIQUE ("idempotency_key");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "custom_oauth_providers_created_at_idx" ON "auth"."custom_oauth_providers" USING "btree" ("created_at");


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "custom_oauth_providers_enabled_idx" ON "auth"."custom_oauth_providers" USING "btree" ("enabled");


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "custom_oauth_providers_identifier_idx" ON "auth"."custom_oauth_providers" USING "btree" ("identifier");


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "custom_oauth_providers_provider_type_idx" ON "auth"."custom_oauth_providers" USING "btree" ("provider_type");


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states" USING "btree" ("created_at");


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_users_created_at_desc" ON "auth"."users" USING "btree" ("created_at" DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_users_email" ON "auth"."users" USING "btree" ("email");


--
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_users_last_sign_in_at_desc" ON "auth"."users" USING "btree" ("last_sign_in_at" DESC);


--
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "idx_users_name" ON "auth"."users" USING "btree" ((("raw_user_meta_data" ->> 'name'::"text"))) WHERE (("raw_user_meta_data" ->> 'name'::"text") IS NOT NULL);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "webauthn_challenges_expires_at_idx" ON "auth"."webauthn_challenges" USING "btree" ("expires_at");


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "webauthn_challenges_user_id_idx" ON "auth"."webauthn_challenges" USING "btree" ("user_id");


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX "webauthn_credentials_credential_id_key" ON "auth"."webauthn_credentials" USING "btree" ("credential_id");


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX "webauthn_credentials_user_id_idx" ON "auth"."webauthn_credentials" USING "btree" ("user_id");


--
-- Name: idx_courses_sequence; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_courses_sequence" ON "public"."courses" USING "btree" ("sequence_order");


--
-- Name: idx_enrollments_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_enrollments_employee" ON "public"."enrollments" USING "btree" ("employee_id");


--
-- Name: idx_lesson_progress_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_lesson_progress_employee" ON "public"."lesson_progress" USING "btree" ("employee_id");


--
-- Name: idx_quiz_attempts_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_quiz_attempts_employee" ON "public"."quiz_attempts" USING "btree" ("employee_id");


--
-- Name: idx_quizzes_subtopic_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_quizzes_subtopic_id" ON "public"."quizzes" USING "btree" ("subtopic_id");


--
-- Name: idx_subtopics_sequence; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_subtopics_sequence" ON "public"."subtopics" USING "btree" ("topic_id", "sequence_order");


--
-- Name: idx_subtopics_topic_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_subtopics_topic_id" ON "public"."subtopics" USING "btree" ("topic_id");


--
-- Name: idx_topics_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_topics_course_id" ON "public"."topics" USING "btree" ("course_id");


--
-- Name: idx_topics_sequence; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_topics_sequence" ON "public"."topics" USING "btree" ("course_id", "sequence_order");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX "messages_inserted_at_topic_index" ON ONLY "realtime"."messages" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_action_filter_selec" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters", "action_filter", COALESCE("selected_columns", '{}'::"text"[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "idx_objects_bucket_id_name_lower" ON "storage"."objects" USING "btree" ("bucket_id", "lower"("name") COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();


--
-- Name: quiz_attempts quiz_attempts_enforce_lockout; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "quiz_attempts_enforce_lockout" BEFORE INSERT ON "public"."quiz_attempts" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_quiz_lockout"();


--
-- Name: courses trg_courses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "trg_courses_updated_at" BEFORE UPDATE ON "public"."courses" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: quizzes trg_quizzes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "trg_quizzes_updated_at" BEFORE UPDATE ON "public"."quizzes" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: subtopics trg_subtopics_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "trg_subtopics_updated_at" BEFORE UPDATE ON "public"."subtopics" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: topics trg_topics_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "trg_topics_updated_at" BEFORE UPDATE ON "public"."topics" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "protect_buckets_delete" BEFORE DELETE ON "storage"."buckets" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."protect_delete"();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "protect_objects_delete" BEFORE DELETE ON "storage"."objects" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."protect_delete"();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."webauthn_challenges"
    ADD CONSTRAINT "webauthn_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY "auth"."webauthn_credentials"
    ADD CONSTRAINT "webauthn_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: employee_skill_progress employee_skill_progress_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employee_skill_progress"
    ADD CONSTRAINT "employee_skill_progress_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id");


--
-- Name: employee_skill_progress employee_skill_progress_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employee_skill_progress"
    ADD CONSTRAINT "employee_skill_progress_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;


--
-- Name: employees employees_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: enrollments enrollments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_attempts"
    ADD CONSTRAINT "quiz_attempts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;


--
-- Name: quizzes quizzes_subtopic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quizzes"
    ADD CONSTRAINT "quizzes_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE CASCADE;


--
-- Name: subtopics subtopics_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."subtopics"
    ADD CONSTRAINT "subtopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE CASCADE;


--
-- Name: topics topics_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."topics"
    ADD CONSTRAINT "topics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;


--
-- Name: topics topics_prerequisite_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."topics"
    ADD CONSTRAINT "topics_prerequisite_topic_id_fkey" FOREIGN KEY ("prerequisite_topic_id") REFERENCES "public"."topics"("id") ON DELETE SET NULL;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: courses admins delete courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete courses" ON "public"."courses" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: glossary_terms admins delete glossary_terms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete glossary_terms" ON "public"."glossary_terms" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: quizzes admins delete quizzes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete quizzes" ON "public"."quizzes" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: skills admins delete skills; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete skills" ON "public"."skills" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: subtopics admins delete subtopics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete subtopics" ON "public"."subtopics" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: topics admins delete topics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins delete topics" ON "public"."topics" FOR DELETE USING ("public"."is_admin"("auth"."uid"()));


--
-- Name: courses admins update courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update courses" ON "public"."courses" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: glossary_terms admins update glossary_terms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update glossary_terms" ON "public"."glossary_terms" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: quizzes admins update quizzes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update quizzes" ON "public"."quizzes" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: skills admins update skills; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update skills" ON "public"."skills" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: subtopics admins update subtopics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update subtopics" ON "public"."subtopics" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: topics admins update topics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins update topics" ON "public"."topics" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: courses admins write courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write courses" ON "public"."courses" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: glossary_terms admins write glossary_terms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write glossary_terms" ON "public"."glossary_terms" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: quizzes admins write quizzes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write quizzes" ON "public"."quizzes" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: skills admins write skills; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write skills" ON "public"."skills" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: subtopics admins write subtopics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write subtopics" ON "public"."subtopics" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: topics admins write topics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admins write topics" ON "public"."topics" FOR INSERT WITH CHECK ("public"."is_admin"("auth"."uid"()));


--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;

--
-- Name: employee_skill_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."employee_skill_progress" ENABLE ROW LEVEL SECURITY;

--
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;

--
-- Name: employees employees can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees can update own profile" ON "public"."employees" FOR UPDATE USING (("auth"."uid"() = "id"));


--
-- Name: employees employees can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees can view own profile" ON "public"."employees" FOR SELECT USING (("auth"."uid"() = "id"));


--
-- Name: enrollments employees manage own enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees manage own enrollments" ON "public"."enrollments" USING (("auth"."uid"() = "employee_id")) WITH CHECK (("auth"."uid"() = "employee_id"));


--
-- Name: lesson_progress employees manage own lesson_progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees manage own lesson_progress" ON "public"."lesson_progress" USING (("auth"."uid"() = "employee_id")) WITH CHECK (("auth"."uid"() = "employee_id"));


--
-- Name: quiz_attempts employees manage own quiz_attempts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees manage own quiz_attempts" ON "public"."quiz_attempts" USING (("auth"."uid"() = "employee_id")) WITH CHECK (("auth"."uid"() = "employee_id"));


--
-- Name: employee_skill_progress employees manage own skill progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "employees manage own skill progress" ON "public"."employee_skill_progress" USING (("auth"."uid"() = "employee_id")) WITH CHECK (("auth"."uid"() = "employee_id"));


--
-- Name: enrollments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;

--
-- Name: glossary_terms; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."glossary_terms" ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."lesson_progress" ENABLE ROW LEVEL SECURITY;

--
-- Name: courses public read courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read courses" ON "public"."courses" FOR SELECT USING (true);


--
-- Name: glossary_terms public read glossary_terms; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read glossary_terms" ON "public"."glossary_terms" FOR SELECT USING (true);


--
-- Name: quizzes public read quizzes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read quizzes" ON "public"."quizzes" FOR SELECT USING (true);


--
-- Name: skills public read skills; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read skills" ON "public"."skills" FOR SELECT USING (true);


--
-- Name: subtopics public read subtopics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read subtopics" ON "public"."subtopics" FOR SELECT USING (true);


--
-- Name: topics public read topics; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read topics" ON "public"."topics" FOR SELECT USING (true);


--
-- Name: quiz_attempts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quiz_attempts" ENABLE ROW LEVEL SECURITY;

--
-- Name: quizzes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quizzes" ENABLE ROW LEVEL SECURITY;

--
-- Name: skills; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;

--
-- Name: subtopics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."subtopics" ENABLE ROW LEVEL SECURITY;

--
-- Name: topics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."topics" ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects admins delete course-assets; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins delete course-assets" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'course-assets'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: objects admins delete course-videos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins delete course-videos" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'course-videos'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: objects admins update course-assets; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins update course-assets" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'course-assets'::"text") AND "public"."is_admin"("auth"."uid"()))) WITH CHECK ((("bucket_id" = 'course-assets'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: objects admins update course-videos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins update course-videos" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'course-videos'::"text") AND "public"."is_admin"("auth"."uid"()))) WITH CHECK ((("bucket_id" = 'course-videos'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: objects admins upload course-assets; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins upload course-assets" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'course-assets'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: objects admins upload course-videos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "admins upload course-videos" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'course-videos'::"text") AND "public"."is_admin"("auth"."uid"())));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects public read course-assets; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "public read course-assets" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'course-assets'::"text"));


--
-- Name: objects public read course-videos; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "public read course-videos" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'course-videos'::"text"));


--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

--
-- Name: SCHEMA "auth"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "auth" TO "anon";
GRANT USAGE ON SCHEMA "auth" TO "authenticated";
GRANT USAGE ON SCHEMA "auth" TO "service_role";
GRANT ALL ON SCHEMA "auth" TO "supabase_auth_admin";
GRANT ALL ON SCHEMA "auth" TO "dashboard_user";
GRANT USAGE ON SCHEMA "auth" TO "postgres";


--
-- Name: SCHEMA "extensions"; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA "extensions" TO "anon";
GRANT USAGE ON SCHEMA "extensions" TO "authenticated";
GRANT USAGE ON SCHEMA "extensions" TO "service_role";
GRANT ALL ON SCHEMA "extensions" TO "dashboard_user";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: SCHEMA "realtime"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "realtime" TO "postgres" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "realtime" TO "anon";
GRANT USAGE ON SCHEMA "realtime" TO "service_role";
GRANT ALL ON SCHEMA "realtime" TO "supabase_realtime_admin" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "realtime" TO "authenticated";


--
-- Name: SCHEMA "storage"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "storage" TO "postgres" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "storage" TO "anon";
GRANT USAGE ON SCHEMA "storage" TO "authenticated";
GRANT USAGE ON SCHEMA "storage" TO "service_role";
GRANT ALL ON SCHEMA "storage" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON SCHEMA "storage" TO "dashboard_user";


--
-- Name: SCHEMA "vault"; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA "vault" TO "postgres" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "vault" TO "service_role";


--
-- Name: FUNCTION "email"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."email"() TO "dashboard_user";


--
-- Name: FUNCTION "jwt"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."jwt"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "dashboard_user";


--
-- Name: FUNCTION "role"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."role"() TO "dashboard_user";


--
-- Name: FUNCTION "uid"(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."armor"("bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."crypt"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."dearmor"("text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."digest"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."digest"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."gen_random_uuid"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text", integer) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "grant_pg_cron_access"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "extensions"."grant_pg_cron_access"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "extensions"."grant_pg_cron_access"() TO "supabase_admin" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."grant_pg_cron_access"() TO "dashboard_user";


--
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."grant_pg_graphql_access"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "grant_pg_net_access"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "extensions"."grant_pg_net_access"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "extensions"."grant_pg_net_access"() TO "supabase_admin" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."grant_pg_net_access"() TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgrst_ddl_watch"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgrst_ddl_watch"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "pgrst_drop_watch"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgrst_drop_watch"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "set_graphql_placeholder"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."set_graphql_placeholder"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v4"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_nil"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_dns"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_oid"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_url"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_x500"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "pg_reload_conf"(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "pg_catalog"."pg_reload_conf"() TO "postgres" WITH GRANT OPTION;


--
-- Name: FUNCTION "get_auth"("p_usename" "text"); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION "pgbouncer"."get_auth"("p_usename" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "pgbouncer"."get_auth"("p_usename" "text") TO "pgbouncer";


--
-- Name: FUNCTION "admin_bulk_import_course"("payload" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."admin_bulk_import_course"("payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_course"("payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_course"("payload" "jsonb") TO "service_role";


--
-- Name: FUNCTION "admin_bulk_import_courses"("payload" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."admin_bulk_import_courses"("payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_courses"("payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_courses"("payload" "jsonb") TO "service_role";


--
-- Name: FUNCTION "admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_bulk_import_topics_into_course"("p_course_slug" "text", "payload" "jsonb") TO "service_role";


--
-- Name: FUNCTION "enforce_quiz_lockout"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."enforce_quiz_lockout"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_quiz_lockout"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_quiz_lockout"() TO "service_role";


--
-- Name: FUNCTION "handle_new_user"(); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


--
-- Name: FUNCTION "is_admin"("uid" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "service_role";


--
-- Name: FUNCTION "my_quiz_lockout_status"("p_module_slug" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."my_quiz_lockout_status"("p_module_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."my_quiz_lockout_status"("p_module_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."my_quiz_lockout_status"("p_module_slug" "text") TO "service_role";


--
-- Name: FUNCTION "quiz_lockout_status"("p_employee_id" "uuid", "p_module_slug" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."quiz_lockout_status"("p_employee_id" "uuid", "p_module_slug" "text") TO "service_role";


--
-- Name: FUNCTION "set_updated_at"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


--
-- Name: FUNCTION "apply_rls"("wal" "jsonb", "max_record_bytes" integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) TO "anon";
GRANT ALL ON FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer) TO "service_role";


--
-- Name: FUNCTION "broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text") TO "dashboard_user";


--
-- Name: FUNCTION "build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) TO "anon";
GRANT ALL ON FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) TO "service_role";


--
-- Name: FUNCTION "cast"("val" "text", "type_" "regtype"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") TO "anon";
GRANT ALL ON FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") TO "service_role";


--
-- Name: FUNCTION "check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") TO "anon";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") TO "service_role";


--
-- Name: FUNCTION "check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) TO "anon";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text", "negate" boolean) TO "service_role";


--
-- Name: FUNCTION "is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) TO "anon";
GRANT ALL ON FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) TO "service_role";


--
-- Name: FUNCTION "list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) TO "dashboard_user";


--
-- Name: FUNCTION "quote_wal2json"("entity" "regclass"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."quote_wal2json"("entity" "regclass") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."quote_wal2json"("entity" "regclass") TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."quote_wal2json"("entity" "regclass") TO "anon";
GRANT ALL ON FUNCTION "realtime"."quote_wal2json"("entity" "regclass") TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."quote_wal2json"("entity" "regclass") TO "service_role";


--
-- Name: FUNCTION "send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean) TO "dashboard_user";


--
-- Name: FUNCTION "send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean) TO "postgres";
GRANT ALL ON FUNCTION "realtime"."send_binary"("payload" "bytea", "event" "text", "topic" "text", "private" boolean) TO "dashboard_user";


--
-- Name: FUNCTION "subscription_check_filters"(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."subscription_check_filters"() TO "postgres";
GRANT ALL ON FUNCTION "realtime"."subscription_check_filters"() TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."subscription_check_filters"() TO "anon";
GRANT ALL ON FUNCTION "realtime"."subscription_check_filters"() TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."subscription_check_filters"() TO "service_role";


--
-- Name: FUNCTION "to_regrole"("role_name" "text"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."to_regrole"("role_name" "text") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."to_regrole"("role_name" "text") TO "dashboard_user";
GRANT ALL ON FUNCTION "realtime"."to_regrole"("role_name" "text") TO "anon";
GRANT ALL ON FUNCTION "realtime"."to_regrole"("role_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "realtime"."to_regrole"("role_name" "text") TO "service_role";


--
-- Name: FUNCTION "topic"(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."topic"() TO "postgres";
GRANT ALL ON FUNCTION "realtime"."topic"() TO "dashboard_user";


--
-- Name: FUNCTION "wal2json_escape_identifier"("name" "text"); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION "realtime"."wal2json_escape_identifier"("name" "text") TO "postgres";
GRANT ALL ON FUNCTION "realtime"."wal2json_escape_identifier"("name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "service_role";


--
-- Name: TABLE "audit_log_entries"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."audit_log_entries" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."audit_log_entries" TO "postgres";
GRANT SELECT ON TABLE "auth"."audit_log_entries" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "custom_oauth_providers"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."custom_oauth_providers" TO "postgres";
GRANT ALL ON TABLE "auth"."custom_oauth_providers" TO "dashboard_user";


--
-- Name: TABLE "flow_state"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."flow_state" TO "postgres";
GRANT SELECT ON TABLE "auth"."flow_state" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."flow_state" TO "dashboard_user";


--
-- Name: TABLE "identities"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."identities" TO "postgres";
GRANT SELECT ON TABLE "auth"."identities" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."identities" TO "dashboard_user";


--
-- Name: TABLE "instances"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."instances" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."instances" TO "postgres";
GRANT SELECT ON TABLE "auth"."instances" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "mfa_amr_claims"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_amr_claims" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_amr_claims" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "dashboard_user";


--
-- Name: TABLE "mfa_challenges"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_challenges" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_challenges" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "dashboard_user";


--
-- Name: TABLE "mfa_factors"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."mfa_factors" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_factors" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_factors" TO "dashboard_user";


--
-- Name: TABLE "oauth_authorizations"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_authorizations" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_authorizations" TO "dashboard_user";


--
-- Name: TABLE "oauth_client_states"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_client_states" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_client_states" TO "dashboard_user";


--
-- Name: TABLE "oauth_clients"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_clients" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_clients" TO "dashboard_user";


--
-- Name: TABLE "oauth_consents"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."oauth_consents" TO "postgres";
GRANT ALL ON TABLE "auth"."oauth_consents" TO "dashboard_user";


--
-- Name: TABLE "one_time_tokens"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."one_time_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."one_time_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "dashboard_user";


--
-- Name: TABLE "refresh_tokens"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."refresh_tokens" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."refresh_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."refresh_tokens" TO "postgres" WITH GRANT OPTION;


--
-- Name: SEQUENCE "refresh_tokens_id_seq"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "dashboard_user";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "postgres";


--
-- Name: TABLE "saml_providers"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."saml_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_providers" TO "dashboard_user";


--
-- Name: TABLE "saml_relay_states"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."saml_relay_states" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_relay_states" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "dashboard_user";


--
-- Name: TABLE "schema_migrations"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE "auth"."schema_migrations" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "sessions"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sessions" TO "postgres";
GRANT SELECT ON TABLE "auth"."sessions" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sessions" TO "dashboard_user";


--
-- Name: TABLE "sso_domains"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sso_domains" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_domains" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_domains" TO "dashboard_user";


--
-- Name: TABLE "sso_providers"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."sso_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_providers" TO "dashboard_user";


--
-- Name: TABLE "users"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."users" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "auth"."users" TO "postgres";
GRANT SELECT ON TABLE "auth"."users" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "webauthn_challenges"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."webauthn_challenges" TO "postgres";
GRANT ALL ON TABLE "auth"."webauthn_challenges" TO "dashboard_user";


--
-- Name: TABLE "webauthn_credentials"; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE "auth"."webauthn_credentials" TO "postgres";
GRANT ALL ON TABLE "auth"."webauthn_credentials" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE "extensions"."pg_stat_statements" FROM "postgres";
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE "extensions"."pg_stat_statements_info" FROM "postgres";
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: TABLE "courses"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";


--
-- Name: TABLE "employee_skill_progress"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."employee_skill_progress" TO "anon";
GRANT ALL ON TABLE "public"."employee_skill_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_skill_progress" TO "service_role";


--
-- Name: TABLE "employees"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";


--
-- Name: TABLE "enrollments"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."enrollments" TO "anon";
GRANT ALL ON TABLE "public"."enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."enrollments" TO "service_role";


--
-- Name: TABLE "glossary_terms"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."glossary_terms" TO "anon";
GRANT ALL ON TABLE "public"."glossary_terms" TO "authenticated";
GRANT ALL ON TABLE "public"."glossary_terms" TO "service_role";


--
-- Name: TABLE "lesson_progress"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."lesson_progress" TO "anon";
GRANT ALL ON TABLE "public"."lesson_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."lesson_progress" TO "service_role";


--
-- Name: TABLE "quiz_attempts"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quiz_attempts" TO "anon";
GRANT ALL ON TABLE "public"."quiz_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_attempts" TO "service_role";


--
-- Name: TABLE "module_certifications"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."module_certifications" TO "anon";
GRANT ALL ON TABLE "public"."module_certifications" TO "authenticated";
GRANT ALL ON TABLE "public"."module_certifications" TO "service_role";


--
-- Name: TABLE "quizzes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quizzes" TO "anon";
GRANT ALL ON TABLE "public"."quizzes" TO "authenticated";
GRANT ALL ON TABLE "public"."quizzes" TO "service_role";


--
-- Name: TABLE "skills"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT ALL ON TABLE "public"."skills" TO "service_role";


--
-- Name: TABLE "subtopics"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."subtopics" TO "anon";
GRANT ALL ON TABLE "public"."subtopics" TO "authenticated";
GRANT ALL ON TABLE "public"."subtopics" TO "service_role";


--
-- Name: TABLE "topics"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."topics" TO "anon";
GRANT ALL ON TABLE "public"."topics" TO "authenticated";
GRANT ALL ON TABLE "public"."topics" TO "service_role";


--
-- Name: TABLE "messages"; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE "realtime"."messages" TO "postgres";
GRANT ALL ON TABLE "realtime"."messages" TO "dashboard_user";
GRANT SELECT,INSERT,UPDATE ON TABLE "realtime"."messages" TO "anon";
GRANT SELECT,INSERT,UPDATE ON TABLE "realtime"."messages" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "realtime"."messages" TO "service_role";


--
-- Name: TABLE "schema_migrations"; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE "realtime"."schema_migrations" TO "postgres";
GRANT ALL ON TABLE "realtime"."schema_migrations" TO "dashboard_user";


--
-- Name: TABLE "subscription"; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE "realtime"."subscription" TO "postgres";
GRANT ALL ON TABLE "realtime"."subscription" TO "dashboard_user";
GRANT SELECT ON TABLE "realtime"."subscription" TO "anon";
GRANT SELECT ON TABLE "realtime"."subscription" TO "authenticated";
GRANT SELECT ON TABLE "realtime"."subscription" TO "service_role";


--
-- Name: SEQUENCE "subscription_id_seq"; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON SEQUENCE "realtime"."subscription_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "realtime"."subscription_id_seq" TO "dashboard_user";
GRANT USAGE ON SEQUENCE "realtime"."subscription_id_seq" TO "anon";
GRANT USAGE ON SEQUENCE "realtime"."subscription_id_seq" TO "authenticated";
GRANT USAGE ON SEQUENCE "realtime"."subscription_id_seq" TO "service_role";


--
-- Name: TABLE "buckets"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE "storage"."buckets" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."buckets" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."buckets" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets" TO "anon";
GRANT ALL ON TABLE "storage"."buckets" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "buckets_analytics"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."buckets_analytics" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "anon";


--
-- Name: TABLE "buckets_vectors"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "service_role";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "authenticated";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "anon";


--
-- Name: TABLE "objects"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE "storage"."objects" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."objects" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."objects" TO "service_role";
GRANT ALL ON TABLE "storage"."objects" TO "authenticated";
GRANT ALL ON TABLE "storage"."objects" TO "anon";
GRANT ALL ON TABLE "storage"."objects" TO "postgres" WITH GRANT OPTION;


--
-- Name: TABLE "s3_multipart_uploads"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "anon";


--
-- Name: TABLE "s3_multipart_uploads_parts"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "anon";


--
-- Name: TABLE "vector_indexes"; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE "storage"."vector_indexes" TO "service_role";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "authenticated";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "anon";


--
-- Name: TABLE "secrets"; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE "vault"."secrets" TO "postgres" WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE "vault"."secrets" TO "service_role";


--
-- Name: TABLE "decrypted_secrets"; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE "vault"."decrypted_secrets" TO "postgres" WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE "vault"."decrypted_secrets" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "extensions" GRANT ALL ON SEQUENCES TO "postgres" WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "extensions" GRANT ALL ON FUNCTIONS TO "postgres" WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "extensions" GRANT ALL ON TABLES TO "postgres" WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql_public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON SEQUENCES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON FUNCTIONS TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "realtime" GRANT ALL ON TABLES TO "dashboard_user";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "service_role";


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


ALTER EVENT TRIGGER "issue_graphql_placeholder" OWNER TO "supabase_admin";

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


ALTER EVENT TRIGGER "issue_pg_cron_access" OWNER TO "supabase_admin";

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


ALTER EVENT TRIGGER "issue_pg_graphql_access" OWNER TO "supabase_admin";

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


ALTER EVENT TRIGGER "issue_pg_net_access" OWNER TO "supabase_admin";

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


ALTER EVENT TRIGGER "pgrst_ddl_watch" OWNER TO "supabase_admin";

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


ALTER EVENT TRIGGER "pgrst_drop_watch" OWNER TO "supabase_admin";

--
-- PostgreSQL database dump complete
--

\unrestrict pyZLHYS1bV0p66qcFsLVMn3d7TcNHUpt14dPzbhvXAjPStEL5cJ6OC9WTov6hAa

