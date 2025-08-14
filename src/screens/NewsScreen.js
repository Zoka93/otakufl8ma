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
import { getAnimeNews } from '../services/anilistApi';

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getAnimeNews();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📰 أخبار الأنمي</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {news.map((item) => (
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
              <Text style={styles.newsTitle}>
                {item.title.english || item.title.romaji}
              </Text>
              <Text style={styles.newsDescription} numberOfLines={3}>
                {item.description?.replace(/<[^>]*>/g, '') || 'لا يوجد وصف متاح'}
              </Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsDate}>
                  {new Date(item.updatedAt * 1000).toLocaleDateString('ar-SA')}
                </Text>
                {item.averageScore && (
                  <Text style={styles.newsScore}>⭐ {item.averageScore / 10}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'right',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  newsScore: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
});