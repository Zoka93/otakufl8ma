import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAnimeDetails } from '../services/anilistApi';

export default function AnimeDetailScreen({ route }) {
  const { id } = route.params;
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnimeDetails();
  }, [id]);

  const loadAnimeDetails = async () => {
    try {
      setLoading(true);
      const data = await getAnimeDetails(id);
      setAnime(data);
    } catch (error) {
      console.error('Error loading anime details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!anime) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>حدث خطأ في تحميل البيانات</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* صورة البانر */}
      {anime.bannerImage && (
        <Image source={{ uri: anime.bannerImage }} style={styles.bannerImage} />
      )}
      
      {/* معلومات الأنمي */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: anime.coverImage.large }} style={styles.coverImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>
              {anime.title.arabic || anime.title.english || anime.title.romaji}
            </Text>
            {anime.averageScore && (
              <View style={styles.scoreContainer}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text style={styles.score}>{anime.averageScore / 10}</Text>
              </View>
            )}
          </View>
        </View>

        {/* الوصف */}
        {anime.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.description}>
              {anime.description.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        )}

        {/* المعلومات الأساسية */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات الأساسية</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>الحالة</Text>
              <Text style={styles.infoValue}>{anime.status}</Text>
            </View>
            {anime.episodes && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>عدد الحلقات</Text>
                <Text style={styles.infoValue}>{anime.episodes}</Text>
              </View>
            )}
            {anime.duration && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>مدة الحلقة</Text>
                <Text style={styles.infoValue}>{anime.duration} دقيقة</Text>
              </View>
            )}
            {anime.season && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>الموسم</Text>
                <Text style={styles.infoValue}>{anime.season} {anime.seasonYear}</Text>
              </View>
            )}
          </View>
        </View>

        {/* التصنيفات */}
        {anime.genres && anime.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التصنيفات</Text>
            <View style={styles.genresContainer}>
              {anime.genres.map((genre, index) => (
                <View key={index} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* الاستوديو */}
        {anime.studios && anime.studios.nodes && anime.studios.nodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الاستوديو</Text>
            <Text style={styles.studioText}>
              {anime.studios.nodes.map(studio => studio.name).join(', ')}
            </Text>
          </View>
        )}

        {/* جدول البث */}
        {anime.airingSchedule && anime.airingSchedule.nodes && anime.airingSchedule.nodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>جدول البث</Text>
            {anime.airingSchedule.nodes.map((episode, index) => (
              <View key={index} style={styles.episodeCard}>
                <Text style={styles.episodeTitle}>الحلقة {episode.episode}</Text>
                <Text style={styles.episodeDate}>
                  {new Date(episode.airingAt * 1000).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* الشخصيات */}
        {anime.characters && anime.characters.nodes && anime.characters.nodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الشخصيات</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {anime.characters.nodes.slice(0, 10).map((character, index) => (
                <View key={index} style={styles.characterCard}>
                  <Image
                    source={{ uri: character.image.large }}
                    style={styles.characterImage}
                  />
                  <Text style={styles.characterName}>{character.name.full}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginLeft: 15,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginRight: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'right',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  genreText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  studioText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  episodeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  episodeDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  characterCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});