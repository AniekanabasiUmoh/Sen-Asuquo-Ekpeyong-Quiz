-- SAEAC — Sprint 2.1: reference seed.
--
-- Mirrors `lgas` and `stages` in content/homepage.ts. If those change, change
-- this too. Idempotent: safe to re-run.
--
-- School counts are the provisional public-school figures from the Principals'
-- Meeting Report and total 117. The public-facing "250+ schools" figure counts
-- private schools and projected participation and is intentionally NOT stored
-- here; see the note above `stats` in content/homepage.ts.

-- Akpabuyo and Bakassi share the qualifier group 'akpabuyo-bakassi' because
-- their comparatively low school counts earn them one joint slot at the Local
-- Government Qualifiers. Grouping by qualifier_group therefore yields six
-- groups, which is what produces the 30-school Group Stage field (6 x 5).
insert into lgas (name, slug, school_count, qualifier_group, is_combined, image_path, sort_order) values
  ('Akpabuyo',             'akpabuyo',             7,  'akpabuyo-bakassi',    true,  '/img/lga-akpabuyo.jpg',             1),
  ('Biase',                'biase',                22, 'biase',               false, '/img/lga-biase.jpg',                2),
  ('Odukpani',             'odukpani',             23, 'odukpani',            false, '/img/lga-odukpani.jpg',             3),
  ('Akamkpa',              'akamkpa',              24, 'akamkpa',             false, '/img/lga-akamkpa.jpg',              4),
  ('Bakassi',              'bakassi',              4,  'akpabuyo-bakassi',    true,  '/img/lga-bakassi.jpg',              5),
  ('Calabar Municipality', 'calabar-municipality', 22, 'calabar-municipality',false, '/img/lga-calabar-municipality.jpg', 6),
  ('Calabar South',        'calabar-south',        15, 'calabar-south',       false, '/img/lga-calabar-south.jpg',        7)
on conflict (slug) do update set
  school_count    = excluded.school_count,
  qualifier_group = excluded.qualifier_group,
  is_combined     = excluded.is_combined,
  image_path      = excluded.image_path,
  sort_order      = excluded.sort_order;

insert into stages (ordinal, name, slug, summary, field_label) values
  (1, 'School Registration', 'school-registration',
   'Public and private secondary schools across the seven LGAs register via the official website.',
   'All eligible schools'),
  (2, 'School-Level Screening', 'school-level-screening',
   'Each school runs three internal examinations (Science, Art, Commercial) on the same day. The top five performers advance.',
   '5 students per school'),
  (3, 'Local Government Qualifiers', 'local-government-qualifiers',
   'Schools within each LGA compete for five qualifying slots across three rounds. Akpabuyo and Bakassi jointly contest one shared slot.',
   '30 schools · 90 students'),
  (4, 'Group Stage', 'group-stage',
   'The five qualifying schools per LGA group compete for three advancing slots at increased difficulty.',
   '18 schools · 54 students'),
  (5, 'Quarterfinals', 'quarterfinals',
   'The three qualifying schools per LGA group compete for two advancing slots at further increased difficulty.',
   '12 schools · 36 students'),
  (6, 'Semifinals', 'semifinals',
   'The top nine advance directly; the bottom three contest a tie-breaker for the tenth Grand Finale place.',
   '10 schools · 30 students'),
  (7, 'Grand Finale', 'grand-finale',
   'Four progressively challenging rounds narrow the field of ten schools to a single overall winner, broadcast live.',
   '1 champion school')
on conflict (slug) do update set
  ordinal     = excluded.ordinal,
  name        = excluded.name,
  summary     = excluded.summary,
  field_label = excluded.field_label;

insert into subjects (name, slug, stream) values
  ('Mathematics',      'mathematics',      null),
  ('English',          'english',          null),
  ('Current Affairs',  'current-affairs',  null),
  ('General Knowledge','general-knowledge',null),
  ('Science',          'science',          'science'),
  ('Art',              'art',              'art'),
  ('Commercial',       'commercial',       'commercial')
on conflict (slug) do update set
  name   = excluded.name,
  stream = excluded.stream;
