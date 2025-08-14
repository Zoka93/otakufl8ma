import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen({ navigation }) {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'أفضل أنمي 2024؟',
      author: 'عشاق_الأنمي',
      replies: 42,
      views: 156,
      time: 'منذ ساعتين',
      category: 'مناقشات عامة',
    },
    {
      id: 2,
      title: 'توقعات للموسم القادم من One Piece',
      author: 'لوفي_فان',
      replies: 28,
      views: 89,
      time: 'منذ 5 ساعات',
      category: 'توقعات',
    },
    {
      id: 3,
      title: 'أفضل شخصية أنثى في الأنمي',
      author: 'أنمي_لوفر',
      replies: 67,
      views: 234,
      time: 'منذ يوم',
      category: 'مناقشات عامة',
    },
  ]);

  const [newDiscussion, setNewDiscussion] = useState('');

  const addDiscussion = () => {
    if (newDiscussion.trim()) {
      const discussion = {
        id: discussions.length + 1,
        title: newDiscussion,
        author: 'أنت',
        replies: 0,
        views: 0,
        time: 'الآن',
        category: 'مناقشات عامة',
      };
      setDiscussions([discussion, ...discussions]);
      setNewDiscussion('');
      Alert.alert('نجح', 'تم إضافة المناقشة بنجاح!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 مجتمع الأنمي</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* إضافة مناقشة جديدة */}
        <View style={styles.addDiscussionCard}>
          <Text style={styles.addDiscussionTitle}>ابدأ مناقشة جديدة</Text>
          <TextInput
            style={styles.input}
            placeholder="اكتب عنوان المناقشة هنا..."
            value={newDiscussion}
            onChangeText={setNewDiscussion}
            multiline
            textAlign="right"
          />
          <TouchableOpacity style={styles.addButton} onPress={addDiscussion}>
            <Text style={styles.addButtonText}>إضافة المناقشة</Text>
          </TouchableOpacity>
        </View>

        {/* قائمة المناقشات */}
        <View style={styles.discussionsSection}>
          <Text style={styles.sectionTitle}>المناقشات الحالية</Text>
          
          {discussions.map((discussion) => (
            <TouchableOpacity
              key={discussion.id}
              style={styles.discussionCard}
              onPress={() => Alert.alert('مناقشة', `فتح مناقشة: ${discussion.title}`)}
            >
              <View style={styles.discussionHeader}>
                <Text style={styles.discussionTitle}>{discussion.title}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{discussion.category}</Text>
                </View>
              </View>
              
              <View style={styles.discussionInfo}>
                <Text style={styles.authorText}>بواسطة: {discussion.author}</Text>
                <Text style={styles.timeText}>{discussion.time}</Text>
              </View>
              
              <View style={styles.discussionStats}>
                <View style={styles.statItem}>
                  <Ionicons name="chatbubbles" size={16} color="#6366f1" />
                  <Text style={styles.statText}>{discussion.replies} رد</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="eye" size={16} color="#6366f1" />
                  <Text style={styles.statText}>{discussion.views} مشاهدة</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* إحصائيات المجتمع */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>إحصائيات المجتمع</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={32} color="#6366f1" />
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>عضو</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles" size={32} color="#6366f1" />
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>مناقشة</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="chatbubble" size={32} color="#6366f1" />
              <Text style={styles.statNumber}>2,890</Text>
              <Text style={styles.statLabel}>رد</Text>
            </View>
          </View>
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
    padding: 15,
  },
  addDiscussionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addDiscussionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 80,
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  discussionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  discussionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  discussionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 14,
    color: '#999',
  },
  discussionStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});