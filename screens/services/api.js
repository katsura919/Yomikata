// api.js
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

// Fetch popular mangas
export const fetchPopularMangas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 51,
        includes: ['cover_art'],
        order: { rating: 'desc' },
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching popular mangas:', error);
    throw error;
  }
};

// Fetch updated mangas (based on chapters updated today)
export const fetchUpdatedChapters = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const formattedDate = startOfToday.toISOString().slice(0, 19);

    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        limit: 30,
        'order[updatedAt]': 'desc',
        'updatedAtSince': formattedDate,
      },
    });

    if (response.status === 200) {
      const chapters = response.data.data;
      const mangaIds = chapters.map((chapter) =>
        chapter.relationships.find((rel) => rel.type === 'manga')?.id
      );
      const uniqueMangaIds = [...new Set(mangaIds)];

      const mangaResponse = await axios.get(`${BASE_URL}/manga`, {
        params: {
          ids: uniqueMangaIds,
          includes: ['cover_art'],
        },
      });

      return mangaResponse.data.data;
    } else {
      throw new Error('Error fetching updated chapters');
    }
  } catch (error) {
    console.error('Error fetching updated chapters:', error);
    throw error;
  }
};

// Search manga by title
export const searchManga = async (query) => {
  if (!query) return;
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: { title: query, limit: 20, includes: ['cover_art'] },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching manga:', error);
    throw error;
  }
};


// Fetch Cover Image
export const getCoverImageUrl = (manga) => {
    if (manga && manga.relationships) {
      const coverRelation = manga.relationships.find((rel) => rel.type === 'cover_art');
      if (coverRelation) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
      }
    }
    return null;
  };