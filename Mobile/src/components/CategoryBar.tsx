import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';

interface CategoryBarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                    <Pressable
                        key={category}
                        onPress={() => onSelectCategory(category)}
                        style={[styles.pill, active && styles.activePill]}
                    >
                        <Text style={[styles.pillText, active && styles.activePillText]}>
                            {category}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        alignItems: 'center',
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    activePill: {
        backgroundColor: '#FF4C24',
        borderColor: '#FF4C24',
    },
    pillText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#49557e',
    },
    activePillText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});