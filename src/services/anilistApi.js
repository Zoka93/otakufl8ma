import { GraphQLClient } from 'graphql-request';

const ANILIST_API = 'https://graphql.anilist.co';

const client = new GraphQLClient(ANILIST_API);

// استعلام جدول البث الأسبوعي
export const getWeeklySchedule = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 50) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            arabic
          }
          coverImage {
            large
            medium
          }
          episodes
          nextAiringEpisode {
            episode
            airingAt
          }
          airingSchedule {
            nodes {
              episode
              airingAt
            }
          }
          averageScore
          genres
        }
      }
    }
  `;

  try {
    const data = await client.request(query);
    return data.Page.media;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
};

// استعلام أخبار الأنمي
export const getAnimeNews = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(type: ANIME, sort: UPDATED_AT_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          updatedAt
          description
          averageScore
        }
      }
    }
  `;

  try {
    const data = await client.request(query);
    return data.Page.media;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

// استعلام تفاصيل الأنمي
export const getAnimeDetails = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id) {
        id
        title {
          romaji
          english
          arabic
        }
        description
        coverImage {
          large
          extraLarge
        }
        bannerImage
        episodes
        duration
        averageScore
        genres
        status
        season
        seasonYear
        studios {
          nodes {
            name
          }
        }
        characters {
          nodes {
            name {
              full
            }
            image {
              large
            }
          }
        }
        airingSchedule {
          nodes {
            episode
            airingAt
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query, { id });
    return data.Media;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

// استعلام البحث في الأنمي
export const searchAnime = async (searchTerm) => {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            arabic
          }
          coverImage {
            large
          }
          averageScore
          genres
        }
      }
    }
  `;

  try {
    const data = await client.request(query, { search: searchTerm });
    return data.Page.media;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};