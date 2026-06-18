import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../services/ThemeContext';

export default function CategoryChip({ label, active, onPress }) {
  const { theme } = useTheme();
	return (
		<TouchableOpacity
			style={[
				styles.chip,
				{ backgroundColor: theme.card, borderColor: theme.border },
				active && { backgroundColor: theme.accent, borderColor: theme.accent },
			]}
			onPress={onPress}
		>
			<Text style={[
				styles.text,
				{ color: active ? '#FFFFFF' : theme.text },
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	active: {
		backgroundColor: '#148F77',
		borderColor: '#148F77',
	},
	text: {
		fontSize: 13,
		color: '#444',
		textTransform: 'capitalize',
	},
	textActive: {
		color: '#FFFFFF',
		fontWeight: '600',
	},
});

