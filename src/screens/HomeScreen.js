import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { getWeeklySchedule, getAnimeNews } from '../services/anilistApi';

export default function HomeScreen({ navigation }) {
  const [schedule, setSchedule] = useState([]);
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scheduleData, newsData] = await Promise.all([
        getWeeklySchedule(),
        getAnimeNews(),
      ]);
      setSchedule(scheduleData);
      setNews(newsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🎌 OtakuFl8ma</Text>
        <Text style={styles.subtitle}>أخبار • مناقشات • جدول البث</Text>
      </View>

      <View style={styles.content}>
        {/* جدول البث */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📺 جدول البث الأسبوعي</Text>
            <TouchableOpacity onPress={() => navigation.navigate('الجدول')}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {schedule.slice(0, 5).map((anime) => (
              <TouchableOpacity
                key={anime.id}
                style={styles.animeCard}
                onPress={() => navigation.navigate('AnimeDetail', { id: anime.id })}
              >
                <Image
                  source={{ uri: anime.coverImage.large }}
                  style={styles.animeImage}
                />
                <View style={styles.animeInfo}>
                  <Text style={styles.animeTitle} numberOfLines={2}>
                    {anime.title.arabic || anime.title.english || anime.title.romaji}
                  </Text>
                  {anime.nextAiringEpisode && (
                    <Text style={styles.episodeInfo}>
                      الحلقة {anime.nextAiringEpisode.episode}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* الأخبار */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📰 آخر الأخبار</Text>
            <TouchableOpacity onPress={() => navigation.navigate('الأخبار')}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          {news.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate('AnimeDetail', { id: item.id })}
            >
              <Image
                source={{ uri: item.coverImage.large }}
                style={styles.newsImage}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title.english || item.title.romaji}
                </Text>
                <Text style={styles.newsDate}>
                  {new Date(item.updatedAt * 1000).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* مناقشات المجتمع */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 مناقشات المجتمع</Text>
          <View style={styles.discussionCard}>
            <Ionicons name="chatbubbles" size={24} color="#6366f1" />
            <View style={styles.discussionContent}>
              <Text style={styles.discussionTitle}>أفضل أنمي 2024؟</Text>
              <Text style={styles.discussionStats}>42 رد • 156 مشاهدة</Text>
            </View>
          </View>
          <View style={styles.discussionCard}>
            <Ionicons name="chatbubbles" size={24} color="#6366f1" />
            <View style={styles.discussionContent}>
              <Text style={styles.discussionTitle}>توقعات للموسم القادم</Text>
              <Text style={styles.discussionStats}>28 رد • 89 مشاهدة</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#6366f1',
    fontSize: 14,
  },
  animeCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animeImage: {
    width: '100%',
    height: 100,
  },
  animeInfo: {
    padding: 10,
  },
  animeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  episodeInfo: {
    fontSize: 12,
    color: '#666',
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: 80,
    height: 80,
  },
  newsContent: {
    flex: 1,
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  discussionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discussionContent: {
    flex: 1,
    marginLeft: 15,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  discussionStats: {
    fontSize: 12,
    color: '#999',
  },
});
