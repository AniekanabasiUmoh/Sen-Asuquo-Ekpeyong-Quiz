/**
 * Database types for the SAEAC schema.
 *
 * Hand-written to match supabase/migrations/*.sql exactly. Once the Supabase
 * CLI is available on a machine with network access, regenerate instead of
 * editing by hand:
 *
 *   npx supabase gen types typescript --project-id lmohoeikidbsiioabmsz > lib/supabase/types.ts
 *
 * If you change a migration, change this file in the same commit.
 */

export type Stream = "science" | "art" | "commercial";

export type RegistrationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "withdrawn";

export type AppRole =
  | "super_admin"
  | "committee"
  | "school_admin"
  | "coach"
  | "student"
  | "judge"
  | "volunteer"
  | "viewer";

export type VolunteerStatus = "applied" | "accepted" | "declined" | "withdrawn";

export type PublishStatus = "draft" | "review" | "published" | "archived";

export type GalleryContentType = "event" | "school" | "student" | "people" | "venue" | "press";

export type MatchStatus =
  | "pending"
  | "live"
  | "paused"
  | "completed"
  | "abandoned";

/** Every scoring event. Assist = 0.5, VAR = 0, per the RD deck. */
export type MatchEventType =
  | "striker_correct"
  | "striker_wrong"
  | "striker_pass"
  | "assist_correct"
  | "assist_wrong"
  | "substitution"
  | "var_referral"
  | "penalty"
  | "adjustment";

export type FixtureStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

/** Columns present on every table. */
type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type Lga = Timestamps & {
  id: string;
  name: string;
  slug: string;
  /** Provisional public-school count. The seven rows total 117. */
  school_count: number;
  /** Akpabuyo and Bakassi share 'akpabuyo-bakassi'; six groups in total. */
  qualifier_group: string;
  is_combined: boolean;
  image_path: string | null;
  sort_order: number;
};

export type Stage = Timestamps & {
  id: string;
  ordinal: number;
  name: string;
  slug: string;
  summary: string;
  field_label: string;
  starts_on: string | null;
  ends_on: string | null;
};

export type Subject = Timestamps & {
  id: string;
  name: string;
  slug: string;
  stream: Stream | null;
};

export type Profile = Timestamps & {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type School = Timestamps & {
  id: string;
  lga_id: string;
  name: string;
  slug: string;
  /** Issued on approval; null until then. */
  registration_no: string | null;
  status: RegistrationStatus;
  is_private: boolean;
  address: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  principal_name: string | null;
  owner_id: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
};

export type Student = Timestamps & {
  id: string;
  school_id: string;
  full_name: string;
  stream: Stream;
  /** 3 Strikers + 2 Assists per team; false means Assist. */
  is_striker: boolean;
  date_of_birth: string | null;
  class_level: string | null;
  photo_path: string | null;
  consent_given: boolean;
  consent_at: string | null;
  consent_version: string | null;
  consent_given_by: string | null;
  consent_withdrawn_at: string | null;
  consent_withdrawn_by: string | null;
};

export type Coach = Timestamps & {
  id: string;
  school_id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
};

export type Fixture = Timestamps & {
  id: string;
  stage_id: string;
  qualifier_group: string | null;
  name: string;
  venue: string | null;
  venue_id: string | null;
  scheduled_at: string | null;
  status: FixtureStatus;
  /** Nothing reaches the public schedule until this is 'published'. */
  publish: PublishStatus;
  notes: string | null;
};

export type Venue = Timestamps & {
  id: string;
  name: string;
  slug: string;
  lga_id: string | null;
  address: string | null;
  capacity: number | null;
};

/** Written by a database trigger whenever a fixture's time or venue moves. */
export type FixtureChange = {
  id: string;
  fixture_id: string;
  changed_by: string | null;
  field: string;
  old_value: string | null;
  new_value: string | null;
  reason: string | null;
  created_at: string;
};

export type FixtureParticipant = {
  id: string;
  fixture_id: string;
  school_id: string;
  created_at: string;
};

export type Result = Timestamps & {
  id: string;
  fixture_id: string;
  school_id: string;
  /** numeric: an Assist answer is worth 0.5. */
  score: number;
  position: number | null;
  advanced: boolean;
  status: PublishStatus;
  published_at: string | null;
};

export type News = Timestamps & {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  image_path: string | null;
  status: PublishStatus;
  published_at: string | null;
  author_id: string | null;
};

export type GalleryItem = Timestamps & {
  id: string;
  title: string | null;
  caption: string | null;
  image_path: string;
  lga_id: string | null;
  stage_id: string | null;
  content_type: GalleryContentType;
  status: PublishStatus;
  sort_order: number;
};

export type Sponsor = Timestamps & {
  id: string;
  name: string;
  slug: string;
  tier: string | null;
  logo_path: string | null;
  website: string | null;
  status: PublishStatus;
  sort_order: number;
};

export type Faq = Timestamps & {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  status: PublishStatus;
  sort_order: number;
};

export type Download = Timestamps & {
  id: string;
  title: string;
  description: string | null;
  version: string | null;
  file_url: string;
  file_size_bytes: number | null;
  status: PublishStatus;
  published_at: string | null;
  download_count: number;
};

export type AppealKind = "registration" | "result" | "schedule" | "other";
export type AppealStatus = "submitted" | "under_review" | "resolved" | "rejected" | "withdrawn";
export type Appeal = Timestamps & {
  id: string;
  school_id: string;
  submitted_by: string;
  kind: AppealKind;
  subject: string;
  details: string;
  evidence_url: string | null;
  status: AppealStatus;
  resolution: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
};

export type Volunteer = Timestamps & {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  lga_id: string | null;
  role_sought: string | null;
  status: VolunteerStatus;
  notes: string | null;
};

export type VolunteerShift = Timestamps & {
  id: string;
  fixture_id: string | null;
  title: string;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  notes: string | null;
};

export type VolunteerShiftAssignment = {
  id: string;
  shift_id: string;
  volunteer_id: string;
  role: string | null;
  created_at: string;
};

export type VolunteerBriefing = Timestamps & {
  id: string;
  shift_id: string | null;
  title: string;
  body: string;
  publish: PublishStatus;
};

export type VolunteerMessage = Timestamps & {
  id: string;
  title: string;
  body: string;
  shift_id: string | null;
  publish: PublishStatus;
  published_at: string | null;
  created_by: string | null;
};

export type Judge = Timestamps & {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  speciality: string | null;
};

export type SchoolDocument = Timestamps & {
  id: string;
  school_id: string;
  label: string;
  /** "<school_id>/<filename>" in the school-documents bucket. */
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
};

export type Match = Timestamps & {
  id: string;
  fixture_id: string;
  name: string;
  status: MatchStatus;
  current_round: number;
  started_at: string | null;
  ended_at: string | null;
  publish: PublishStatus;
};

export type MatchRound = {
  id: string;
  match_id: string;
  ordinal: number;
  name: string;
  description: string | null;
  created_at: string;
};

export type MatchEvent = {
  id: string;
  match_id: string;
  round_id: string | null;
  school_id: string;
  student_id: string | null;
  event_type: MatchEventType;
  /** numeric: an Assist answer is worth 0.5. */
  points: number;
  question_no: number | null;
  student_out: string | null;
  student_in: string | null;
  note: string | null;
  recorded_by: string | null;
  created_at: string;
};

/** View: the sum of match_events. The single source of truth for a score. */
export type MatchStanding = {
  match_id: string;
  school_id: string;
  score: number;
  striker_correct: number;
  assist_correct: number;
  var_referrals: number;
  substitutions: number;
};

export type JudgeAssignment = {
  id: string;
  judge_id: string;
  fixture_id: string;
  role: string;
  created_at: string;
};

export type SimulcastLink = {
  platform: string;
  url: string;
  label?: string;
};

export type Broadcast = Timestamps & {
  id: string;
  match_id: string | null;
  title: string;
  /** Embed id, not a full URL: the page controls the embed parameters. */
  embed_id: string | null;
  platform: string;
  starts_at: string | null;
  status: string;
  publish: PublishStatus;
  /** Other platforms carrying the same stream simultaneously. */
  simulcast_links: SimulcastLink[];
};

export type AwardKind =
  | "champion"
  | "runner_up"
  | "third_place"
  | "top_student"
  | "best_coach"
  | "best_lga"
  | "consolation"
  | "special";

export type Season = Timestamps & {
  id: string;
  year: number;
  name: string;
  starts_on: string | null;
  ends_on: string | null;
  is_current: boolean;
};

export type Award = Timestamps & {
  id: string;
  season_id: string;
  kind: AwardKind;
  title: string;
  description: string | null;
  school_id: string | null;
  student_id: string | null;
  coach_id: string | null;
  prize_value: number | null;
  prize_note: string | null;
  publish: PublishStatus;
};

export type PrizeFulfilment = Timestamps & {
  id: string;
  award_id: string;
  status: string;
  due_on: string | null;
  delivered_on: string | null;
  note: string | null;
  recorded_by: string | null;
};

export type LegacyProject = Timestamps & {
  id: string;
  season_id: string | null;
  lga_id: string | null;
  title: string;
  description: string | null;
  status: string;
  started_on: string | null;
  completed_on: string | null;
  publish: PublishStatus;
};

export type AccreditationHolder = "student" | "coach" | "volunteer" | "judge";

export type Accreditation = {
  id: string;
  holder_type: AccreditationHolder;
  holder_id: string;
  code: string;
  issued_at: string;
  checked_in_at: string | null;
  checked_in_by: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  match_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  before: unknown | null;
  after: unknown | null;
  reason: string | null;
  created_at: string;
};

/**
 * Insert shape: everything optional except the columns the database actually
 * requires, with the generated ones allowed but never demanded.
 *
 * `id`, `created_at` and `updated_at` are optional rather than omitted. Omitting
 * them sounds stricter, but supabase-js checks for excess properties, so a
 * caller spreading a `Partial<Row>` (which carries those keys as `undefined`)
 * would be rejected for passing keys the type says cannot exist.
 */
type Insertable<T extends Timestamps, Required extends keyof T> = Partial<T> &
  Pick<T, Required>;

/**
 * `Relationships` is required: supabase-js reads it when inferring the shape of
 * a query, and a table type without it collapses to `never`. It is left empty
 * because nothing here relies on generated join inference; foreign keys are
 * still enforced by Postgres, and joins are written explicitly.
 */
type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      lgas: Table<Lga, Insertable<Lga, "name" | "slug" | "school_count" | "qualifier_group" | "sort_order">, Partial<Lga>>;
      stages: Table<Stage, Insertable<Stage, "ordinal" | "name" | "slug" | "summary" | "field_label">, Partial<Stage>>;
      subjects: Table<Subject, Insertable<Subject, "name" | "slug">, Partial<Subject>>;
      profiles: Table<Profile, Insertable<Profile, never> & { id: string }, Partial<Profile>>;
      user_roles: Table<UserRole, { user_id: string; role: AppRole }, Partial<UserRole>>;
      schools: Table<School, Insertable<School, "lga_id" | "name" | "slug">, Partial<School>>;
      students: Table<Student, Insertable<Student, "school_id" | "full_name" | "stream">, Partial<Student>>;
      coaches: Table<Coach, Insertable<Coach, "school_id" | "full_name">, Partial<Coach>>;
      fixtures: Table<Fixture, Insertable<Fixture, "stage_id" | "name">, Partial<Fixture>>;
      fixture_participants: Table<FixtureParticipant, { fixture_id: string; school_id: string }, Partial<FixtureParticipant>>;
      venues: Table<Venue, Insertable<Venue, "name" | "slug">, Partial<Venue>>;
      matches: Table<Match, Insertable<Match, "fixture_id" | "name">, Partial<Match>>;
      broadcasts: Table<Broadcast, Insertable<Broadcast, "title">, Partial<Broadcast>>;
      seasons: Table<Season, Insertable<Season, "year" | "name">, Partial<Season>>;
      awards: Table<Award, Insertable<Award, "season_id" | "kind" | "title">, Partial<Award>>;
      prize_fulfilment: Table<
        PrizeFulfilment,
        Insertable<PrizeFulfilment, "award_id">,
        Partial<PrizeFulfilment>
      >;
      legacy_projects: Table<
        LegacyProject,
        Insertable<LegacyProject, "title">,
        Partial<LegacyProject>
      >;
      match_rounds: Table<
        MatchRound,
        Partial<MatchRound> & Pick<MatchRound, "match_id" | "ordinal" | "name">,
        Partial<MatchRound>
      >;
      match_events: Table<
        MatchEvent,
        Partial<MatchEvent> & Pick<MatchEvent, "match_id" | "school_id" | "event_type">,
        Partial<MatchEvent>
      >;
      judge_assignments: Table<
        JudgeAssignment,
        Partial<JudgeAssignment> & Pick<JudgeAssignment, "judge_id" | "fixture_id">,
        Partial<JudgeAssignment>
      >;
      fixture_changes: Table<
        FixtureChange,
        Partial<FixtureChange> & Pick<FixtureChange, "fixture_id" | "field">,
        Partial<FixtureChange>
      >;
      results: Table<Result, Insertable<Result, "fixture_id" | "school_id">, Partial<Result>>;
      news: Table<News, Insertable<News, "title" | "slug">, Partial<News>>;
      gallery_items: Table<GalleryItem, Insertable<GalleryItem, "image_path">, Partial<GalleryItem>>;
      sponsors: Table<Sponsor, Insertable<Sponsor, "name" | "slug">, Partial<Sponsor>>;
      faqs: Table<Faq, Insertable<Faq, "question" | "answer">, Partial<Faq>>;
      downloads: Table<Download, Insertable<Download, "title" | "file_url">, Partial<Download>>;
      appeals: Table<Appeal, Insertable<Appeal, "school_id" | "submitted_by" | "kind" | "subject" | "details">, Partial<Appeal>>;
      volunteers: Table<Volunteer, Insertable<Volunteer, "full_name" | "email">, Partial<Volunteer>>;
      judges: Table<Judge, Insertable<Judge, "full_name">, Partial<Judge>>;
      volunteer_shifts: Table<
        VolunteerShift,
        Insertable<VolunteerShift, "title">,
        Partial<VolunteerShift>
      >;
      volunteer_shift_assignments: Table<
        VolunteerShiftAssignment,
        Pick<VolunteerShiftAssignment, "shift_id" | "volunteer_id"> &
          Partial<VolunteerShiftAssignment>,
        Partial<VolunteerShiftAssignment>
      >;
      volunteer_briefings: Table<
        VolunteerBriefing,
        Insertable<VolunteerBriefing, "title" | "body">,
        Partial<VolunteerBriefing>
      >;
      volunteer_messages: Table<
        VolunteerMessage,
        Insertable<VolunteerMessage, "title" | "body">,
        Partial<VolunteerMessage>
      >;
      school_documents: Table<
        SchoolDocument,
        Insertable<SchoolDocument, "school_id" | "label" | "storage_path">,
        Partial<SchoolDocument>
      >;
      // No RLS policy permits update or delete, so the trail is append-only at
      // the database level. `Update` is typed as an empty object rather than
      // `never` because `never` collapses inference for the whole client.
      audit_log: Table<
        AuditLog,
        Partial<Omit<AuditLog, "id" | "created_at">> &
          Pick<AuditLog, "action" | "entity">,
        Record<string, never>
      >;
      // No RLS policy permits update, only insert and delete, so `Update` is
      // an empty object for the same reason as audit_log above.
      chat_messages: Table<
        ChatMessage,
        Pick<ChatMessage, "match_id" | "user_id" | "body">,
        Record<string, never>
      >;
      accreditations: Table<
        Accreditation,
        Pick<Accreditation, "holder_type" | "holder_id">,
        Partial<Accreditation>
      >;
    };
    // Views, Functions and CompositeTypes are required by supabase-js's schema
    // constraint. Omitting them makes the whole schema fail to match, and every
    // query result silently degrades to `never`, which is a confusing failure
    // to diagnose. They are empty because the schema defines none.
    // A view still needs the full table shape. Giving it only `Row` makes the
    // schema fail supabase-js's constraint, and every query in the client
    // collapses to `never` -- the same trap as omitting Views entirely.
    Views: {
      match_standings: {
        Row: MatchStanding;
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Functions: {
      /** Issues the next SAEAC-YYYY-NNNN number under an advisory lock. */
      issue_registration_number: {
        Args: { school: string };
        Returns: string;
      };
      /** Roster totals and whether the 3 Strikers + 2 Assists rule is met. */
      roster_status: {
        Args: { target: string };
        Returns: {
          total: number;
          strikers: number;
          assists: number;
          is_valid: boolean;
        }[];
      };
      check_in_accreditation: {
        Args: { scanned_code: string };
        Returns: {
          ok: boolean;
          message: string;
          holder_type: AccreditationHolder | null;
          holder_name: string | null;
          detail: string | null;
        }[];
      };
      /** Live public figures. Not the client's approved 250+/10,000+ projections. */
      public_counts: {
        Args: Record<string, never>;
        Returns: {
          approved_schools: number;
          participating_lgas: number;
          registered_students: number;
        }[];
      };
      /** Snapshots a match's standings into results. Committee only. */
      /** Live scoreboard for one match. Empty unless published or privileged. */
      live_scoreboard: {
        Args: { target_match: string };
        Returns: {
          school_id: string;
          school_name: string;
          score: number;
          striker_correct: number;
          assist_correct: number;
          var_referrals: number;
          substitutions: number;
          rank: number;
        }[];
      };
      chat_author_names: {
        Args: { target_match: string; user_ids: string[] };
        Returns: { user_id: string; full_name: string | null }[];
      };
      publish_match_results: {
        Args: { target_match: string };
        Returns: number;
      };
      create_match_setup: {
        Args: { target_fixture: string; target_name: string; target_school_ids?: string[] };
        Returns: string;
      };
      /** Registration and participation by LGA. Committee only. */
      registration_report: {
        Args: Record<string, never>;
        Returns: {
          lga_name: string;
          eligible: number;
          drafts: number;
          submitted: number;
          approved: number;
          rejected: number;
          students: number;
        }[];
      };
      progression_report: {
        Args: Record<string, never>;
        Returns: {
          stage_ordinal: number;
          stage_name: string;
          entered: number;
          advanced: number;
        }[];
      };
      attendance_report: {
        Args: Record<string, never>;
        Returns: {
          holder_type: AccreditationHolder;
          issued: number;
          checked_in: number;
          revoked: number;
        }[];
      };
      lga_registration_counts: {
        Args: Record<string, never>;
        Returns: {
          lga_id: string;
          lga_name: string;
          qualifier_group: string;
          approved: number;
          pending: number;
        }[];
      };
    };
    CompositeTypes: Record<never, never>;
    Enums: {
      stream: Stream;
      registration_status: RegistrationStatus;
      app_role: AppRole;
      volunteer_status: VolunteerStatus;
      publish_status: PublishStatus;
      fixture_status: FixtureStatus;
      match_status: MatchStatus;
      match_event_type: MatchEventType;
      award_kind: AwardKind;
      accreditation_holder: AccreditationHolder;
    };
  };
};
