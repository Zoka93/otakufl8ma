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
import { getWeeklySchedule } from '../services/anilistApi';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function ScheduleScreen({ navigation }) {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await getWeeklySchedule();
      setSchedule(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedule();
    setRefreshing(false);
  };

  const getAnimeForDay = (dayIndex) => {
    // تصفية الأنمي حسب اليوم (هذا مثال بسيط)
    return schedule.filter((anime, index) => index % 7 === dayIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 جدول البث الأسبوعي</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* أيام الأسبوع */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.selectedDayButton,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === index && styles.selectedDayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* قائمة الأنمي لليوم المحدد */}
        <View style={styles.animeList}>
          {getAnimeForDay(selectedDay).map((anime) => (
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
                <Text style={styles.animeTitle}>
                  {anime.title.arabic || anime.title.english || anime.title.romaji}
                </Text>
                <Text style={styles.animeGenres}>
                  {anime.genres.slice(0, 2).join(' • ')}
                </Text>
                {anime.nextAiringEpisode && (
                  <Text style={styles.episodeInfo}>
                    الحلقة {anime.nextAiringEpisode.episode}
                  </Text>
                )}
                {anime.averageScore && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>⭐ {anime.averageScore / 10}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  },
  daysContainer: {
    padding: 15,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDayButton: {
    backgroundColor: '#6366f1',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  animeList: {
    padding: 15,
  },
  animeCard: {
    flexDirection: 'row',
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
  animeImage: {
    width: 100,
    height: 150,
  },
  animeInfo: {
    flex: 1,
    padding: 15,
  },
  animeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  animeGenres: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  episodeInfo: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 10,
  },
  scoreContainer: {
    alignSelf: 'flex-start',
  },
  score: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
});