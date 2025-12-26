import { algoliasearch } from "algoliasearch";

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export const algoliaAdmin = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
algoliaAdmin.setSettings({
  indexName: process.env.POSTS_INDEX_NAME!,
  indexSettings: {
    attributesForFaceting: ["filterOnly(id)", "filterOnly(authorId)"],
  },
});
