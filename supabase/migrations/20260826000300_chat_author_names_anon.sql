-- Public live match pages need to resolve the display name of a chat poster.
-- The function itself is security-definer and only returns names for users who
-- posted in a match the caller may already see; granting execute to anon does
-- not expose the profiles table or arbitrary profile lookup.
grant execute on function chat_author_names(uuid, uuid[]) to anon;
